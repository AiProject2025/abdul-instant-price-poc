-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  property_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add client_id and property_id to scenarios table
ALTER TABLE public.scenarios 
ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE;

-- Enable RLS on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties
CREATE POLICY "Users can view their own properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_name ON public.clients(name);
CREATE INDEX idx_properties_client_id ON public.properties(client_id);
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_scenarios_client_id ON public.scenarios(client_id);
CREATE INDEX idx_scenarios_property_id ON public.scenarios(property_id);