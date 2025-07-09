-- Create scenarios table to store different quote scenarios
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  form_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own scenarios" 
ON public.scenarios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenarios" 
ON public.scenarios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenarios" 
ON public.scenarios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scenarios" 
ON public.scenarios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create scenario results table to store pricing results for each scenario
CREATE TABLE public.scenario_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  rate DECIMAL(5,3) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  loan_amount DECIMAL(15,2) NOT NULL,
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scenario_results ENABLE ROW LEVEL SECURITY;

-- Create policies for scenario results
CREATE POLICY "Users can view results for their scenarios" 
ON public.scenario_results 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = scenario_results.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can create results for their scenarios" 
ON public.scenario_results 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = scenario_results.scenario_id 
  AND scenarios.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates on scenarios
CREATE TRIGGER update_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_scenarios_user_id ON public.scenarios(user_id);
CREATE INDEX idx_scenario_results_scenario_id ON public.scenario_results(scenario_id);