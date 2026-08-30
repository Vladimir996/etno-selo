import { useTranslations } from "next-intl";

type StepIndicatorProps = {
  current: number;
  maxUnlocked: number;
  onStepClick: (step: number) => void;
};

export default function StepIndicator({ current, maxUnlocked, onStepClick }: StepIndicatorProps) {
  const t = useTranslations("Booking");
  const STEPS = [
    { number: 1, label: t("stepCabin") },
    { number: 2, label: t("stepDates") },
    { number: 3, label: t("stepDetails") },
  ];

  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((step, i) => {
        const isCurrent = step.number === current;
        const isDone = step.number < current;
        const isReachable = step.number <= maxUnlocked;

        return (
          <li key={step.number} className="flex flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              disabled={!isReachable}
              onClick={() => onStepClick(step.number)}
              className="flex items-center gap-2.5 disabled:cursor-not-allowed"
            >
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCurrent
                    ? "bg-forest-800 text-cream-100"
                    : isDone
                      ? "bg-forest-800/15 text-forest-800"
                      : "bg-forest-900/10 text-forest-900/40",
                ].join(" ")}
              >
                {isDone ? "✓" : step.number}
              </span>
              <span
                className={[
                  "hidden text-sm font-medium sm:inline",
                  isCurrent ? "text-forest-950" : "text-forest-900/50",
                ].join(" ")}
              >
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={`h-px flex-1 ${isDone ? "bg-forest-800/40" : "bg-wood-700/15"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
