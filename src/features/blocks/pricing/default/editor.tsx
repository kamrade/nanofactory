"use client";

import type { BlockEditorProps } from "../../shared/types";
import { DebouncedTextArea, DebouncedTextInput } from "../../shared/editor/debounced-text-field";
import { UIButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISelect } from "@/components/ui/select";

type PricingPlan = {
  title: string;
  price: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  includes: string[];
};

function readSectionTitle(props: Record<string, unknown>) {
  return typeof props.sectionTitle === "string" ? props.sectionTitle : "";
}

function readSubtitle(props: Record<string, unknown>) {
  return typeof props.subtitle === "string" ? props.subtitle : "";
}

function readFeaturedIndex(props: Record<string, unknown>) {
  return typeof props.featuredIndex === "number" && Number.isInteger(props.featuredIndex)
    ? props.featuredIndex
    : 1;
}

function readPlans(props: Record<string, unknown>): PricingPlan[] {
  if (!Array.isArray(props.plans)) {
    return [];
  }

  return props.plans
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;

      return {
        title: typeof record.title === "string" ? record.title : "",
        price: typeof record.price === "string" ? record.price : "",
        description: typeof record.description === "string" ? record.description : "",
        buttonText: typeof record.buttonText === "string" ? record.buttonText : "",
        buttonHref: typeof record.buttonHref === "string" ? record.buttonHref : "",
        includes: Array.isArray(record.includes)
          ? record.includes.filter((entry): entry is string => typeof entry === "string")
          : [],
      };
    })
    .filter((item): item is PricingPlan => item !== null);
}

function stringifyIncludes(value: string[]) {
  return value.join("\n");
}

function parseIncludesValue(value: string) {
  return value.replace(/\r\n/g, "\n").split("\n");
}

export function PricingDefaultEditor({ block, onChange }: BlockEditorProps) {
  const sectionTitle = readSectionTitle(block.props);
  const subtitle = readSubtitle(block.props);
  const featuredIndex = readFeaturedIndex(block.props);
  const plans = readPlans(block.props);

  function update(nextProps: Partial<Record<"sectionTitle" | "subtitle" | "featuredIndex" | "plans", unknown>>) {
    onChange({
      ...block.props,
      ...nextProps,
    });
  }

  function updatePlan(index: number, nextPlan: PricingPlan) {
    update({
      plans: plans.map((plan, planIndex) => (planIndex === index ? nextPlan : plan)),
    });
  }

  function addPlan() {
    update({
      plans: [
        ...plans,
        {
          title: "",
          price: "",
          description: "",
          buttonText: "",
          buttonHref: "",
          includes: [],
        },
      ],
    });
  }

  function removePlan(index: number) {
    const nextPlans = plans.filter((_, planIndex) => planIndex !== index);
    update({
      plans: nextPlans,
      featuredIndex:
        nextPlans.length === 0 ? 0 : Math.min(featuredIndex, nextPlans.length - 1),
    });
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-0">
          <UIFormRow label="Section title" htmlFor="pricing-section-title" borderless>
            <DebouncedTextInput
              id="pricing-section-title"
              size="sm"
              borderless
              value={sectionTitle}
              placeholder="Pricing"
              onCommit={(value) => update({ sectionTitle: value })}
            />
          </UIFormRow>

          <UIFormRow label="Subtitle" htmlFor="pricing-subtitle" borderless>
            <DebouncedTextArea
              id="pricing-subtitle"
              size="lg"
              borderless
              value={subtitle}
              rows={3}
              placeholder="A short line under the title that explains the pricing structure."
              onCommit={(value) => update({ subtitle: value })}
            />
          </UIFormRow>

          <UIFormRow label="Featured plan" htmlFor="pricing-featured-index" borderless>
            <UISelect
              id="pricing-featured-index"
              ariaLabel="Featured plan"
              size="sm"
              borderless
              className="w-full"
              value={String(featuredIndex)}
              onValueChange={(value) => update({ featuredIndex: Number(value) })}
              options={plans.map((plan, index) => ({
                value: String(index),
                label: plan.title.trim().length > 0 ? plan.title : `Plan ${index + 1}`,
                textValue: plan.title.trim().length > 0 ? plan.title : `Plan ${index + 1}`,
              }))}
            />
          </UIFormRow>
        </div>
      </Card>

      <div className="flex justify-start">
        <UIButton type="button" size="sm" theme="primary" variant="contained" onClick={addPlan}>
          Add plan
        </UIButton>
      </div>

      {plans.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-sm text-text-muted">
          No plans yet. Add the first pricing plan.
        </p>
      ) : (
        <div className="grid gap-3">
          {plans.map((plan, index) => (
            <Card key={`${block.id}-pricing-plan-${index}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-text-main">
                  Plan {index + 1}
                  {index === featuredIndex ? (
                    <span className="ml-2 rounded-full border border-focus/40 bg-focus/15 px-2 py-0.5 text-xs font-medium text-text-main">
                      Featured
                    </span>
                  ) : null}
                </p>
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() => removePlan(index)}
                >
                  Remove
                </UIButton>
              </div>

              <UIFormRow label="Title" htmlFor={`pricing-title-${index}`} borderless>
                <DebouncedTextInput
                  id={`pricing-title-${index}`}
                  size="sm"
                  borderless
                  value={plan.title}
                  placeholder="Starter"
                  onCommit={(value) =>
                    updatePlan(index, {
                      ...plan,
                      title: value,
                    })
                  }
                />
              </UIFormRow>

              <UIFormRow label="Price" htmlFor={`pricing-price-${index}`} borderless>
                <DebouncedTextInput
                  id={`pricing-price-${index}`}
                  size="sm"
                  borderless
                  value={plan.price}
                  placeholder="$19"
                  onCommit={(value) =>
                    updatePlan(index, {
                      ...plan,
                      price: value,
                    })
                  }
                />
              </UIFormRow>

              <UIFormRow label="Description" htmlFor={`pricing-description-${index}`} borderless>
                <DebouncedTextArea
                  id={`pricing-description-${index}`}
                  size="lg"
                  borderless
                  value={plan.description}
                  rows={3}
                  placeholder="Describe what this plan is for in a little more detail."
                  onCommit={(value) =>
                    updatePlan(index, {
                      ...plan,
                      description: value,
                    })
                  }
                />
              </UIFormRow>

              <div className="grid gap-3">
                <UIFormRow label="Button text" htmlFor={`pricing-button-text-${index}`} borderless>
                  <DebouncedTextInput
                    id={`pricing-button-text-${index}`}
                    size="sm"
                    borderless
                    value={plan.buttonText}
                    placeholder="Choose plan"
                    onCommit={(value) =>
                      updatePlan(index, {
                        ...plan,
                        buttonText: value,
                      })
                    }
                  />
                </UIFormRow>

                <UIFormRow label="Button link" htmlFor={`pricing-button-href-${index}`} borderless>
                  <DebouncedTextInput
                    id={`pricing-button-href-${index}`}
                    size="sm"
                    borderless
                    value={plan.buttonHref}
                    placeholder="/contact"
                    onCommit={(value) =>
                      updatePlan(index, {
                        ...plan,
                        buttonHref: value,
                      })
                    }
                  />
                </UIFormRow>
              </div>

              <UIFormRow label="Includes" htmlFor={`pricing-includes-${index}`} borderless>
                <DebouncedTextArea
                  id={`pricing-includes-${index}`}
                  size="lg"
                  borderless
                  value={stringifyIncludes(plan.includes)}
                  rows={4}
                  placeholder="One item per line"
                  onCommit={(value) =>
                    updatePlan(index, {
                      ...plan,
                      includes: parseIncludesValue(value),
                    })
                  }
                />
              </UIFormRow>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
