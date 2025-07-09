import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Property {
  id: string;
  client_id: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  property_type?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ClientWithProperties extends Client {
  properties: Property[];
  totalQuotes: number;
  lastQuoteDate?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<ClientWithProperties[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchClients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setClients([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Search clients by name
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .ilike('name', `%${searchTerm}%`);

      if (clientsError) throw clientsError;

      // Search properties by address
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*, clients(*)')
        .ilike('address', `%${searchTerm}%`);

      if (propertiesError) throw propertiesError;

      // Combine results and get unique clients
      const clientIds = new Set([
        ...clientsData.map(c => c.id),
        ...propertiesData.map(p => p.client_id)
      ]);

      const enrichedClients: ClientWithProperties[] = [];

      for (const clientId of clientIds) {
        const client = clientsData.find(c => c.id === clientId) || 
                      propertiesData.find(p => p.client_id === clientId)?.clients;
        
        if (!client) continue;

        // Get properties for this client
        const { data: clientProperties, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('client_id', clientId);

        if (propError) throw propError;

        // Get scenarios count and last quote date
        const { data: scenarios, error: scenariosError } = await supabase
          .from('scenarios')
          .select('created_at')
          .eq('client_id', clientId)
          .is('deleted_at', null);

        if (scenariosError) throw scenariosError;

        const totalQuotes = scenarios.length;
        const lastQuoteDate = scenarios.length > 0 
          ? scenarios.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : undefined;

        enrichedClients.push({
          ...client,
          properties: clientProperties,
          totalQuotes,
          lastQuoteDate
        });
      }

      setClients(enrichedClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error searching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating client:', err);
      throw err;
    }
  };

  const createProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .insert([{ ...propertyData, user_id: user.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating property:', err);
      throw err;
    }
  };

  const findOrCreateClient = async (name: string, email?: string, phone?: string) => {
    try {
      // First, try to find existing client
      const { data: existingClient } = await supabase
        .from('clients')
        .select('*')
        .eq('name', name)
        .single();

      if (existingClient) {
        return existingClient;
      }

      // Create new client if not found
      return await createClient({ name, email, phone });
    } catch (err) {
      console.error('Error finding or creating client:', err);
      throw err;
    }
  };

  const findOrCreateProperty = async (clientId: string, address: string, city?: string, state?: string, zipCode?: string, propertyType?: string) => {
    try {
      // First, try to find existing property
      const { data: existingProperty } = await supabase
        .from('properties')
        .select('*')
        .eq('client_id', clientId)
        .eq('address', address)
        .single();

      if (existingProperty) {
        return existingProperty;
      }

      // Create new property if not found
      return await createProperty({ 
        client_id: clientId, 
        address, 
        city, 
        state, 
        zip_code: zipCode, 
        property_type: propertyType 
      });
    } catch (err) {
      console.error('Error finding or creating property:', err);
      throw err;
    }
  };

  return {
    clients,
    loading,
    error,
    searchClients,
    createClient,
    createProperty,
    findOrCreateClient,
    findOrCreateProperty
  };
};