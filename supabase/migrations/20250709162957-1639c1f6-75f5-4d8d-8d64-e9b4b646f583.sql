-- Add soft delete functionality to scenarios
ALTER TABLE public.scenarios 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN deleted_by_name TEXT DEFAULT NULL;

-- Create audit log table for tracking scenario deletions and changes
CREATE TABLE public.scenario_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'deleted', 'restored', 'created', 'updated'
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  scenario_name TEXT NOT NULL,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  additional_data JSONB DEFAULT NULL
);

-- Enable RLS on audit log
ALTER TABLE public.scenario_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for audit log
CREATE POLICY "Users can view audit logs for their scenarios" 
ON public.scenario_audit_log 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create audit logs for their scenarios" 
ON public.scenario_audit_log 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Update scenarios policies to handle soft deletes
DROP POLICY IF EXISTS "Users can view their own scenarios" ON public.scenarios;
CREATE POLICY "Users can view their own scenarios" 
ON public.scenarios 
FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Create policy to view deleted scenarios
CREATE POLICY "Users can view their own deleted scenarios" 
ON public.scenarios 
FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NOT NULL);

-- Create function to soft delete scenarios with audit logging
CREATE OR REPLACE FUNCTION public.soft_delete_scenario(
  scenario_id_param UUID,
  user_name_param TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  scenario_name_var TEXT;
BEGIN
  -- Get scenario name for audit log
  SELECT name INTO scenario_name_var 
  FROM public.scenarios 
  WHERE id = scenario_id_param AND user_id = auth.uid();
  
  IF scenario_name_var IS NULL THEN
    RAISE EXCEPTION 'Scenario not found or access denied';
  END IF;
  
  -- Soft delete the scenario
  UPDATE public.scenarios 
  SET deleted_at = now(), deleted_by_name = user_name_param
  WHERE id = scenario_id_param AND user_id = auth.uid();
  
  -- Log the deletion
  INSERT INTO public.scenario_audit_log (
    scenario_id, action, user_id, user_name, scenario_name, additional_data
  ) VALUES (
    scenario_id_param, 'deleted', auth.uid(), user_name_param, scenario_name_var, 
    jsonb_build_object('deleted_at', now())
  );
END;
$$;

-- Create function to restore scenarios
CREATE OR REPLACE FUNCTION public.restore_scenario(
  scenario_id_param UUID,
  user_name_param TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  scenario_name_var TEXT;
BEGIN
  -- Get scenario name for audit log
  SELECT name INTO scenario_name_var 
  FROM public.scenarios 
  WHERE id = scenario_id_param AND user_id = auth.uid();
  
  IF scenario_name_var IS NULL THEN
    RAISE EXCEPTION 'Scenario not found or access denied';
  END IF;
  
  -- Restore the scenario
  UPDATE public.scenarios 
  SET deleted_at = NULL, deleted_by_name = NULL
  WHERE id = scenario_id_param AND user_id = auth.uid();
  
  -- Log the restoration
  INSERT INTO public.scenario_audit_log (
    scenario_id, action, user_id, user_name, scenario_name, additional_data
  ) VALUES (
    scenario_id_param, 'restored', auth.uid(), user_name_param, scenario_name_var,
    jsonb_build_object('restored_at', now())
  );
END;
$$;