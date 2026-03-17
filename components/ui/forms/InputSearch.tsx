import { IonIcon, IonInput, IonLabel, IonText } from '@ionic/react';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormClearErrors,
} from 'react-hook-form';

type TSearchInput<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  clearErrors: UseFormClearErrors<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassnames?: string;
  icon?: string;
  errorClassName?: string;
  suggestions: string[];
};

type DropdownPortalProps = {
  anchorRef: React.RefObject<HTMLDivElement>;
  items: string[];
  activeIndex: number;
  onSelect: (item: string) => void;
  onMouseEnter: (idx: number) => void;
  hasQuery: boolean;
};

const getPortalTarget = (anchor: HTMLElement): Element => {
  const ionContent = anchor.closest('ion-content');
  if (ionContent) {
    // Ionic renders .inner-scroll inside ion-content's shadow root
    const inner = ionContent.shadowRoot?.querySelector('.inner-scroll');
    if (inner) return inner;
    return ionContent;
  }
  return document.body;
};

const DropdownPortal = ({
  anchorRef,
  items,
  activeIndex,
  onSelect,
  onMouseEnter,
  hasQuery,
}: DropdownPortalProps) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!anchorRef.current) return;

    const target = getPortalTarget(anchorRef.current);
    setPortalTarget(target);

    const updatePosition = () => {
      if (!anchorRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollTop = (target as Element).scrollTop ?? 0;

      setStyle({
        position: 'absolute',
        top: anchorRect.bottom - targetRect.top + scrollTop + 2,
        left: anchorRect.left - targetRect.left,
        width: anchorRect.width,
        zIndex: 500,
      });
    };

    updatePosition();

    // rAF loop keeps position in sync during scroll/layout shifts
    let frameId: number;
    const loop = () => {
      updatePosition();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [anchorRef]);

  if (!portalTarget) return null;
  if (items.length === 0 && !hasQuery) return null;

  return ReactDOM.createPortal(
    <ul
      role="listbox"
      style={{
        ...style,
        backgroundColor: '#fff',
        border: '1px solid #d4d4d8',
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        maxHeight: '12rem',
        overflowY: 'auto',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {items.length === 0 ? (
        <li
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            color: '#a1a1aa',
            fontStyle: 'italic',
            userSelect: 'none',
          }}
        >
          No data found
        </li>
      ) : (
        items.map((item, idx) => (
          <li
            key={item}
            role="option"
            aria-selected={idx === activeIndex}
            onMouseDown={e => {
              e.preventDefault();
              onSelect(item);
            }}
            onMouseEnter={() => onMouseEnter(idx)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              color: idx === activeIndex ? '#ea580c' : '#3f3f46',
              backgroundColor: idx === activeIndex ? '#fff7ed' : 'transparent',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {item}
          </li>
        ))
      )}
    </ul>,
    portalTarget,
  );
};

const SearchInput = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  label,
  placeholder = '',
  required = false,
  disabled = false,
  className,
  labelClassName = '',
  containerClassnames = '',
  icon = '',
  errorClassName = '',
  suggestions = [],
}: TSearchInput<T>) => {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);

  const getUniqueSuggestions = (list: string[]) => Array.from(new Set(list));

    const handleFilter = (value: string) => {
        const query = (value ?? "").toLowerCase().trim();
        const uniqueSuggestions = getUniqueSuggestions(suggestions);

        if (!query) {
            setFiltered(uniqueSuggestions);
        } else {
            setFiltered(
            uniqueSuggestions.filter((s) =>
                s.toLowerCase().includes(query)
            )
            );
        }

        setActiveIndex(-1);
        };
    useEffect(() => {
    setFiltered(getUniqueSuggestions(suggestions));
    }, [suggestions]);



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full" ref={containerRef}>
          <div className={classNames('w-full flex items-start gap-1', containerClassnames)}>
            {label && (
              <div>
                <IonLabel
                  class="custom"
                  className={classNames(
                    '!text-xs !text-black !font-medium text-end w-24',
                    labelClassName,
                  )}
                >
                  {label}
                </IonLabel>
              </div>
            )}

            <div className="w-full" ref={inputWrapRef}>
              <IonInput
                clearInput
                {...field}
                type="search"
                aria-label={label || 'search'}
                placeholder={placeholder}
                onIonInput={e => {
                  const value = e.detail.value ?? '';
                  clearErrors(name);
                  clearErrors('root');
                  field.onChange(value);
                  handleFilter(value);
                  if (!value.trim()) {
                    setFiltered(suggestions);
                    setOpen(true);
                  }
                }}
                onFocus={() => {
                  handleFilter(field.value ?? '');
                  setOpen(true);
                }}
                disabled={disabled}
                onIonBlur={field.onBlur}
                className={classNames(
                  'text-xs !bg-white ![--background:white] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:0.75rem] !min-h-[0.75rem]',
                  error && '![--border-color:red] !border-red-600 !text-black',
                  className,
                )}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (!open || filtered.length === 0) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter' && activeIndex >= 0) {
                    e.preventDefault();
                    field.onChange(filtered[activeIndex]);
                    setOpen(false);
                  } else if (e.key === 'Escape') {
                    setOpen(false);
                  }
                }}
              >
                {icon && (
                  <IonIcon
                    slot="start"
                    icon={icon}
                    aria-hidden="true"
                    className="fill-orange-400"
                  />
                )}
              </IonInput>

              {open && (
                <DropdownPortal
                  anchorRef={inputWrapRef}
                  items={getUniqueSuggestions(filtered)}
                  activeIndex={activeIndex}
                  hasQuery={!!(field.value ?? '').trim()}
                  onSelect={item => {
                    field.onChange(item);
                    setOpen(false);
                  }}
                  onMouseEnter={setActiveIndex}
                />
              )}

              <div className="text-start">
                {error && (
                  <IonText
                    slot="error"
                    color="danger"
                    className={classNames('text-xs font-semibold block', errorClassName)}
                  >
                    {error.message}
                  </IonText>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default SearchInput;