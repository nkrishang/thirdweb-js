"use client";

import { ChevronDownIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Anchor } from "../ui/Anchor";
import { DynamicHeight } from "./DynamicHeight";

type CustomAccordionProps = {
  anchorId?: string;
  chevronPosition?: "left" | "right";
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  triggerContainerClassName?: string;
  containerClassName?: string;
};

export function CustomAccordion(props: CustomAccordionProps) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen || false);
  const contentId = useId();
  const buttonId = useId();
  const accordionContentRef = useRef<HTMLDivElement>(null);

  // if window hash matches current accordion's id, open it
  const accordionIdMatchChecked = useRef(false);
  useEffect(() => {
    if (accordionIdMatchChecked.current) {
      return;
    }
    accordionIdMatchChecked.current = true;
    const hash = window.location.hash;
    if (hash && hash === `#${props.anchorId}`) {
      setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => {
          accordionContentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 500);
      }, 500);
    }
  }, [props.anchorId]);

  // if window hash matches any child accordion's id, open it
  const accordionContentChecked = useRef(false);
  useEffect(() => {
    const accordionContentEl = accordionContentRef.current;
    if (!accordionContentEl || accordionContentChecked.current) {
      return;
    }

    accordionContentChecked.current = true;

    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    // if any child element has an anchor tag with href that matches the hash, open the accordion
    const containsMatchingAnchor = Array.from(
      accordionContentEl.querySelectorAll("a[href^='#']"),
    ).find((childAccordion) => {
      const href = childAccordion.getAttribute("href");
      return href === hash;
    });

    if (containsMatchingAnchor) {
      setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => {
          containsMatchingAnchor.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 500);
      }, 500);
    }
  }, []);

  return (
    <div
      className={cn("border-b", props.containerClassName)}
      data-custom-accordion
    >
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full flex-1 cursor-pointer items-center gap-3",
          props.triggerContainerClassName,
          props.chevronPosition === "right"
            ? "flex-row-reverse justify-between"
            : "",
        )}
        data-open={isOpen}
        id={buttonId}
        onClick={() => {
          setIsOpen((c) => !c);
        }}
        type="button"
      >
        <ChevronDownIcon
          className={cn(
            "ease size-4 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />

        {props.anchorId ? (
          <Anchor id={props.anchorId}> {props.trigger} </Anchor>
        ) : (
          props.trigger
        )}
      </button>

      <DynamicHeight>
        <div className="overflow-hidden" data-open={isOpen} id={contentId}>
          <div
            className={cn(
              "fade-in-0 animate-in duration-500",
              !isOpen && "hidden",
            )}
          >
            <div className="pt-1 pb-4" ref={accordionContentRef}>
              {props.children}
            </div>
          </div>
        </div>
      </DynamicHeight>
    </div>
  );
}
