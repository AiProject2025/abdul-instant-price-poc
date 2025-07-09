import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClients } from './useClients';
import { useToast } from '@/hooks/use-toast';

export interface Scenario {
  id: string;
  name: string;
  form_data: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  deleted_by_name?: string;
}

export interface AuditLog {
  id: string;
  scenario_id: string;
  action: string;
  user_id: string;
  user_name: string;
  scenario_name: string;
  performed_at: string;
  additional_data: any;
}

export interface ScenarioResult {
  id: string;
  scenario_id: string;
  buyer_name: string;
  rate: number;
  price: number;
  loan_amount: number;
  additional_data: any;
  created_at: string;
}

export const useScenarios = () => {
  const { findOrCreateClient, findOrCreateProperty } = useClients();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [deletedScenarios, setDeletedScenarios] = useState<Scenario[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [scenarioResults, setScenarioResults] = useState<Record<string, ScenarioResult[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setScenarios(data || []);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scenarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchScenarioResults = async (scenarioId: string) => {
    try {
      const { data, error } = await supabase
        .from('scenario_results')
        .select('*')
        .eq('scenario_id', scenarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setScenarioResults(prev => ({
        ...prev,
        [scenarioId]: data || []
      }));
      
      return data || [];
    } catch (error) {
      console.error('Error fetching scenario results:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scenario results",
        variant: "destructive"
      });
      return [];
    }
  };

  const saveScenario = async (name: string, formData: any): Promise<string | null> => {
    setLoading(true);
    try {
      // Extract client information from form data
      const clientName = formData.borrowerName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
      const clientEmail = formData.email;
      const clientPhone = formData.phone;
      
      // Extract property information from form data
      const propertyAddress = formData.propertyAddress || `${formData.streetAddress || ''}, ${formData.city || ''}, ${formData.propertyState || ''}`.trim();
      const propertyCity = formData.city;
      const propertyState = formData.propertyState;
      const propertyZip = formData.zipCode;
      const propertyType = formData.propertyType;
      
      // Create or find client
      const client = await findOrCreateClient(clientName, clientEmail, clientPhone);
      
      // Create or find property
      const property = await findOrCreateProperty(
        client.id, 
        propertyAddress, 
        propertyCity, 
        propertyState, 
        propertyZip, 
        propertyType
      );
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to save scenarios",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('scenarios')
        .insert({
          user_id: user.id,
          name,
          form_data: formData,
          client_id: client.id,
          property_id: property.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario saved successfully"
      });

      await fetchScenarios();
      return data.id;
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast({
        title: "Error",
        description: "Failed to save scenario",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveScenarioResults = async (scenarioId: string, results: any[]) => {
    try {
      const resultsToInsert = results.map(result => ({
        scenario_id: scenarioId,
        buyer_name: result.noteBuyer || result.lender,
        rate: result.rate,
        price: result.price || 0,
        loan_amount: result.loanAmount || 0,
        additional_data: {
          monthlyPayment: result.monthlyPayment,
          totalInterest: result.totalInterest,
          product: result.product,
          ...result
        }
      }));

      const { error } = await supabase
        .from('scenario_results')
        .insert(resultsToInsert);

      if (error) throw error;

      await fetchScenarioResults(scenarioId);
    } catch (error) {
      console.error('Error saving scenario results:', error);
      toast({
        title: "Error",
        description: "Failed to save scenario results",
        variant: "destructive"
      });
    }
  };

  const getUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 'Unknown User';
      
      // Try to get the user's profile with full_name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      
      return profile?.full_name || user.email || 'Unknown User';
    } catch (error) {
      console.error('Error getting user name:', error);
      return 'Unknown User';
    }
  };

  const deleteScenario = async (scenarioId: string) => {
    try {
      const userName = await getUserName();
      
      const { error } = await supabase.rpc('soft_delete_scenario', {
        scenario_id_param: scenarioId,
        user_name_param: userName
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario deleted successfully"
      });

      await fetchScenarios();
      // Remove results from state
      setScenarioResults(prev => {
        const newResults = { ...prev };
        delete newResults[scenarioId];
        return newResults;
      });
    } catch (error) {
      console.error('Error deleting scenario:', error);
      toast({
        title: "Error",
        description: "Failed to delete scenario",
        variant: "destructive"
      });
    }
  };

  const fetchDeletedScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      setDeletedScenarios(data || []);
    } catch (error) {
      console.error('Error fetching deleted scenarios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deleted scenarios",
        variant: "destructive"
      });
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('scenario_audit_log')
        .select('*')
        .order('performed_at', { ascending: false });

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive"
      });
    }
  };

  const restoreScenario = async (scenarioId: string) => {
    try {
      const userName = await getUserName();
      
      const { error } = await supabase.rpc('restore_scenario', {
        scenario_id_param: scenarioId,
        user_name_param: userName
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario restored successfully"
      });

      await fetchScenarios();
      await fetchDeletedScenarios();
    } catch (error) {
      console.error('Error restoring scenario:', error);
      toast({
        title: "Error",
        description: "Failed to restore scenario",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  return {
    scenarios,
    deletedScenarios,
    auditLogs,
    scenarioResults,
    loading,
    saveScenario,
    saveScenarioResults,
    deleteScenario,
    restoreScenario,
    fetchScenarioResults,
    fetchDeletedScenarios,
    fetchAuditLogs,
    refetchScenarios: fetchScenarios
  };
};