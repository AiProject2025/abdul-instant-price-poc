import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Scenario {
  id: string;
  name: string;
  form_data: any;
  created_at: string;
  updated_at: string;
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
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
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
    try {
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
          form_data: formData
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

  const deleteScenario = async (scenarioId: string) => {
    try {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', scenarioId);

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

  useEffect(() => {
    fetchScenarios();
  }, []);

  return {
    scenarios,
    scenarioResults,
    loading,
    saveScenario,
    saveScenarioResults,
    deleteScenario,
    fetchScenarioResults,
    refetchScenarios: fetchScenarios
  };
};