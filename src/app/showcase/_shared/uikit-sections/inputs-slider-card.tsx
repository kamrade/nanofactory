"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UISlider } from "@/components/ui/slider";

export function InputsSliderCard() {
  const [slider01Value, setSlider01Value] = useState(0.42);
  const [slider1000Value, setSlider1000Value] = useState(640);
  const [sliderRangeValue, setSliderRangeValue] = useState(14);

  return (
    <UICard title="UIKit · Slider">
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="max-w-xl">
            <UISlider
              label="Volume"
              showValue
              valueFormatter={(value) => `${value}%`}
              defaultValue={72}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="max-w-xl">
            <UISlider
              label="Brightness"
              showValue
              valueFormatter={(value) => `${value}%`}
              defaultValue={48}
              min={0}
              max={100}
              step={2}
            />
          </div>

          <div className="max-w-xl">
            <UISlider label="Disabled" showValue defaultValue={30} disabled />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="max-w-xl">
            <UISlider
              label="0 → 1"
              showValue
              value={slider01Value}
              onValueChange={setSlider01Value}
              min={0}
              max={1}
              step={0.01}
              valueFormatter={(value) => value.toFixed(2)}
            />
          </div>

          <div className="max-w-xl">
            <UISlider
              label="0 → 1000"
              showValue
              value={slider1000Value}
              onValueChange={setSlider1000Value}
              min={0}
              max={1000}
              step={10}
              valueFormatter={(value) => value.toLocaleString("en-US")}
            />
          </div>

          <div className="max-w-xl">
            <UISlider
              label="10 → 20"
              showValue
              value={sliderRangeValue}
              onValueChange={setSliderRangeValue}
              min={10}
              max={20}
              step={0.1}
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        </div>
      </div>
    </UICard>
  );
}
