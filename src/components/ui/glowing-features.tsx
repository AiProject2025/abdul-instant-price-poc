"use client";

import { Calculator, Zap, TrendingUp, Shield, Clock, DollarSign } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function GlowingFeaturesGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Coming Soon
          </Badge>
          <h2 className="text-4xl font-bold text-blue-900">
            Next-Generation Lending Platform
          </h2>
        </div>
        <p className="text-xl text-slate-600">Powered by docIQ 1.0 Beta and advanced analytics</p>
      </div>
      
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Calculator className="h-4 w-4" />}
          title="AI-Optimized Rates"
          description="Our machine learning algorithms analyze thousands of data points to secure the most competitive DSCR loan rates in real-time."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Zap className="h-4 w-4" />}
          title="Instant Processing"
          description="Advanced automation and AI-driven document analysis streamline approvals, reducing processing time by 90%."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<TrendingUp className="h-4 w-4" />}
          title="Smart Analytics"
          description="Predictive analytics and market intelligence help maximize your investment property's ROI potential."
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Shield className="h-4 w-4" />}
          title="Enterprise Security"
          description="Bank-level encryption and AI-powered fraud detection ensure your financial data remains completely secure."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Clock className="h-4 w-4" />}
          title="24/7 AI Assistant"
          description="Our intelligent virtual assistant provides instant support and guidance throughout your lending journey."
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-blue-200 bg-blue-50 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};