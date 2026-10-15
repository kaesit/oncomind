import React, { useState } from "react";
import * as RDialog from "@radix-ui/react-dialog";
import * as RSelect from "@radix-ui/react-select";
import * as RSwitch from "@radix-ui/react-switch";
import * as RCheckbox from "@radix-ui/react-checkbox";
import * as RRadio from "@radix-ui/react-radio-group";
import { Check, ChevronDown, CircleCheck, CircleHelp, Info, Loader2, OctagonAlert, Search, TriangleAlert, X } from "lucide-react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ------------------------------------------------------------- Button */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
     variant?: "default" | "primary" | "lime" | "ghost" | "danger" | "glass";
     size?: "md" | "sm";
     icon?: React.ReactNode;
     iconOnly?: boolean;
     block?: boolean;
     loading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
     { variant = "default", size = "md", icon, iconOnly, block, loading, className, children, disabled, type = "button", ...rest },
     ref
) {
     return (
          <button
               ref={ref}
               type={type}
               disabled={disabled || loading}
               className={cx(
                    "om-btn",
                    variant !== "default" && `om-btn--${variant}`,
                    size === "sm" && "om-btn--sm",
                    iconOnly && "om-btn--icon",
                    block && "om-btn--block",
                    className
               )}
               {...rest}
          >
               {loading ? <Loader2 size={16} className="om-spin" /> : icon}
               {!iconOnly && children}
          </button>
     );
});

/* -------------------------------------------------------------- Card */
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
     aura?: "green" | "orange" | "pink" | "violet" | "blue" | "teal";
     flush?: boolean;
     interactive?: boolean;
     selected?: boolean;
};
export function Card({ aura, flush, interactive, selected, className, ...rest }: CardProps) {
     return (
          <div
               className={cx(
                    "om-card",
                    aura && `om-aura om-aura--${aura}`,
                    flush && "om-card--flush",
                    interactive && "om-card--interactive",
                    selected && "om-card--selected",
                    className
               )}
               {...rest}
          />
     );
}

export function CardHead({ title, sub, children }: { title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
     return (
          <div className="om-card-head">
               <div style={{ minWidth: 0 }}>
                    <h3 className="om-card-title">{title}</h3>
                    {sub && <p className="om-card-sub">{sub}</p>}
               </div>
               {children}
          </div>
     );
}

/* --------------------------------------------------------- PageHeader */
export function PageHeader({ title, sub, children }: { title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
     return (
          <header className="om-page-head">
               <div>
                    <h1 className="om-page-title">{title}</h1>
                    {sub && <p className="om-page-sub">{sub}</p>}
               </div>
               {children && <div className="om-toolbar">{children}</div>}
          </header>
     );
}

/* ------------------------------------------------------------ Inputs */
export function Field({
     label,
     error,
     hint,
     full,
     children,
     htmlFor,
}: {
     label?: React.ReactNode;
     error?: string | null;
     hint?: React.ReactNode;
     full?: boolean;
     htmlFor?: string;
     children: React.ReactNode;
}) {
     return (
          <div className={cx("om-field", full && "om-field--full")}>
               {label && (
                    <label className="om-label" htmlFor={htmlFor}>
                         {label}
                    </label>
               )}
               {children}
               {error ? <span className="om-error">{error}</span> : hint ? <span className="om-hint">{hint}</span> : null}
          </div>
     );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
     function Input({ className, invalid, ...rest }, ref) {
          return <input ref={ref} className={cx("om-input", className)} aria-invalid={invalid || undefined} {...rest} />;
     }
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
     function Textarea({ className, invalid, ...rest }, ref) {
          return <textarea ref={ref} className={cx("om-textarea", className)} aria-invalid={invalid || undefined} {...rest} />;
     }
);

export function SearchInput({
     value,
     onChange,
     placeholder,
     width,
}: {
     value: string;
     onChange: (v: string) => void;
     placeholder?: string;
     width?: number | string;
}) {
     return (
          <div className="om-search" style={{ width }}>
               <Search size={16} />
               <input
                    className="om-input"
                    type="search"
                    value={value}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    onChange={(e) => onChange(e.target.value)}
               />
          </div>
     );
}

/* ------------------------------------------------------------ Select */
const CLEAR = "__om_clear__";

export function Select({
     items,
     value,
     defaultValue,
     onChange,
     placeholder = "Select…",
     clearable,
     clearLabel = "All",
     ariaLabel,
     id,
}: {
     items: string[];
     value?: string | null;
     defaultValue?: string;
     onChange?: (v: string | null) => void;
     placeholder?: string;
     /** adds a first "All" option that resets the value to null */
     clearable?: boolean;
     clearLabel?: string;
     ariaLabel?: string;
     id?: string;
}) {
     // Radix treats "" as "no value" which shows the placeholder.
     const controlled = value !== undefined;
     return (
          <RSelect.Root
               {...(controlled ? { value: value ?? "" } : { defaultValue })}
               onValueChange={(v) => onChange?.(v === CLEAR ? null : v)}
          >
               <RSelect.Trigger className="om-select-trigger" aria-label={ariaLabel ?? placeholder} id={id}>
                    <RSelect.Value placeholder={placeholder} />
                    <RSelect.Icon>
                         <ChevronDown size={16} />
                    </RSelect.Icon>
               </RSelect.Trigger>
               <RSelect.Portal>
                    <RSelect.Content className="om-select-content om-portal" position="popper" sideOffset={6}>
                         <RSelect.Viewport className="om-select-viewport">
                              {clearable && (
                                   <RSelect.Item value={CLEAR} className="om-select-item">
                                        <RSelect.ItemText>{clearLabel}</RSelect.ItemText>
                                   </RSelect.Item>
                              )}
                              {items.map((it) => (
                                   <RSelect.Item key={it} value={it} className="om-select-item">
                                        <RSelect.ItemText>{it}</RSelect.ItemText>
                                        <RSelect.ItemIndicator>
                                             <Check size={14} />
                                        </RSelect.ItemIndicator>
                                   </RSelect.Item>
                              ))}
                         </RSelect.Viewport>
                    </RSelect.Content>
               </RSelect.Portal>
          </RSelect.Root>
     );
}

/* ------------------------------------------------- Switch / Checkbox */
export function Switch(props: { checked?: boolean; defaultChecked?: boolean; onChange?: (v: boolean) => void; id?: string; ariaLabel?: string }) {
     return (
          <RSwitch.Root
               className="om-switch"
               id={props.id}
               aria-label={props.ariaLabel}
               checked={props.checked}
               defaultChecked={props.defaultChecked}
               onCheckedChange={props.onChange}
          >
               <RSwitch.Thumb className="om-switch-thumb" />
          </RSwitch.Root>
     );
}

export function Checkbox({
     checked,
     onChange,
     ariaLabel,
     glass,
     indeterminate,
}: {
     checked: boolean;
     onChange: (v: boolean) => void;
     ariaLabel?: string;
     glass?: boolean;
     indeterminate?: boolean;
}) {
     return (
          <RCheckbox.Root
               className={cx("om-checkbox", glass && "om-checkbox--glass")}
               checked={indeterminate ? "indeterminate" : checked}
               onCheckedChange={(v) => onChange(v === true)}
               onClick={(e) => e.stopPropagation()}
               aria-label={ariaLabel}
          >
               <RCheckbox.Indicator>
                    {indeterminate ? <span style={{ width: 9, height: 2, background: "currentColor", display: "block" }} /> : <Check size={13} strokeWidth={3} />}
               </RCheckbox.Indicator>
          </RCheckbox.Root>
     );
}

export function RadioGroup({ items, defaultValue, value, onChange, ariaLabel }: { items: string[]; defaultValue?: string; value?: string; onChange?: (v: string) => void; ariaLabel?: string }) {
     return (
          <RRadio.Root className="om-radio-group" defaultValue={defaultValue} value={value} onValueChange={onChange} aria-label={ariaLabel}>
               {items.map((it) => (
                    <RRadio.Item key={it} value={it} className="om-radio">
                         {it}
                    </RRadio.Item>
               ))}
          </RRadio.Root>
     );
}

/* ------------------------------------------------------------ Dialog */
export function Dialog({
     open,
     onOpenChange,
     title,
     description,
     width = 520,
     children,
     footer,
     bodyStyle,
}: {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     title: React.ReactNode;
     description?: React.ReactNode;
     width?: number;
     children: React.ReactNode;
     footer?: React.ReactNode;
     bodyStyle?: React.CSSProperties;
}) {
     return (
          <RDialog.Root open={open} onOpenChange={onOpenChange}>
               <RDialog.Portal>
                    <RDialog.Overlay className="om-overlay" />
                    <RDialog.Content
                         className="om-dialog om-portal"
                         style={{ "--w": `${width}px` } as React.CSSProperties}
                    >
                         <div className="om-dialog-head">
                              <div>
                                   <RDialog.Title className="om-dialog-title">{title}</RDialog.Title>
                                   {description ? (
                                        <RDialog.Description className="om-dialog-desc">{description}</RDialog.Description>
                                   ) : (
                                        <RDialog.Description style={{ display: "none" }}>{String(title)}</RDialog.Description>
                                   )}
                              </div>
                              <RDialog.Close asChild>
                                   <Button variant="ghost" size="sm" iconOnly icon={<X size={18} />} aria-label="Close" />
                              </RDialog.Close>
                         </div>
                         <div className="om-dialog-body" style={bodyStyle}>
                              {children}
                         </div>
                         {footer && <div className="om-dialog-foot">{footer}</div>}
                    </RDialog.Content>
               </RDialog.Portal>
          </RDialog.Root>
     );
}

/* ------------------------------------------------------ Status & bits */
const STATUS_TONE: Record<string, string> = {
     URGENT: "var(--om-urgent)",
     CRITICAL: "var(--om-urgent)",
     HIGH: "var(--om-high)",
     NORMAL: "var(--om-normal)",
     STABLE: "var(--om-stable)",
     RECOVERING: "var(--om-stable)",
     LOW: "var(--om-stable)",
     MALIGNANT: "var(--om-urgent)",
     BENIGN: "var(--om-stable)",
};
export const statusTone = (s?: string) => STATUS_TONE[String(s ?? "").toUpperCase()] ?? "var(--om-neutral)";

/**
 * Every status gets a distinct *shape*, not just a colour, so it still reads
 * for colour-blind users: octagon = urgent, triangle = high, circle-i = normal,
 * circle-check = stable.
 */
const STATUS_ICON: Record<string, typeof Info> = {
     URGENT: OctagonAlert,
     CRITICAL: OctagonAlert,
     MALIGNANT: OctagonAlert,
     HIGH: TriangleAlert,
     NORMAL: Info,
     STABLE: CircleCheck,
     RECOVERING: CircleCheck,
     LOW: CircleCheck,
     BENIGN: CircleCheck,
};

export function StatusIcon({ status, size = 13 }: { status?: string; size?: number }) {
     const Icon = STATUS_ICON[String(status ?? "").toUpperCase()] ?? CircleHelp;
     return <Icon size={size} strokeWidth={2.4} aria-hidden style={{ flex: "none" }} />;
}

/** Status with colour + icon + text. `solid` = filled pill for use on top of photos, where a tinted one gets lost. */
export function StatusPill({ status, solid, children }: { status?: string; solid?: boolean; children?: React.ReactNode }) {
     return (
          <span className={cx("om-pill", solid ? "om-pill--solid" : "om-pill--tone")} style={{ "--tone": statusTone(status) } as React.CSSProperties}>
               <StatusIcon status={status} />
               {children ?? status}
          </span>
     );
}

/** Inline (pill-less) status for dense tables: icon + coloured text. */
export function StatusText({ status }: { status?: string }) {
     return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: statusTone(status), fontWeight: 600 }}>
               <StatusIcon status={status} size={14} />
               {status}
          </span>
     );
}

export function Pill({ tone = "default", children, style }: { tone?: "default" | "lime" | "ink" | "glass"; children: React.ReactNode; style?: React.CSSProperties }) {
     return (
          <span className={cx("om-pill", tone !== "default" && `om-pill--${tone}`)} style={style}>
               {children}
          </span>
     );
}

/** Tick ruler; `ratio` (0..1) places a marker — only pass a ratio derived from real data. */
export function Ticks({ count = 36, ratio }: { count?: number; ratio?: number }) {
     const r = ratio === undefined || !isFinite(ratio) ? undefined : Math.min(1, Math.max(0, ratio));
     return (
          <div className="om-ticks" aria-hidden>
               {Array.from({ length: count }, (_, i) => (
                    <span key={i} data-on={r !== undefined && i / (count - 1) <= r} />
               ))}
               {r !== undefined && <i className="om-ticks-marker" style={{ left: `${r * 100}%` }} />}
          </div>
     );
}

export function Empty({ icon, title, children }: { icon?: React.ReactNode; title: React.ReactNode; children?: React.ReactNode }) {
     return (
          <div className="om-empty">
               {icon}
               <b>{title}</b>
               {children}
          </div>
     );
}

const AURAS = ["violet", "pink", "orange", "green", "blue", "teal"] as const;
export const initialsOf = (name: string) =>
     name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0])
          .join("")
          .toUpperCase() || "?";

/** Image that falls back to a gradient initials tile when the URL is missing or broken. */
export function MediaImage({ src, alt }: { src?: string; alt: string }) {
     const [broken, setBroken] = useState(false);
     const aura = AURAS[(alt.length + (alt.charCodeAt(0) || 0)) % AURAS.length];
     const usable = src && !broken && !src.includes("via.placeholder.com");
     return usable ? (
          <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />
     ) : (
          <div className={cx("om-media-fallback", `om-aura--${aura}`)}>
               {initialsOf(alt)}
          </div>
     );
}
