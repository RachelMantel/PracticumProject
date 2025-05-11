import { trigger, transition, style, animate, query, stagger } from "@angular/animations"

export const fadeIn = trigger("fadeIn", [
  transition(":enter", [style({ opacity: 0 }), animate("300ms ease-out", style({ opacity: 1 }))]),
])

export const slideIn = trigger("slideIn", [
  transition(":enter", [
    style({ transform: "translateY(20px)", opacity: 0 }),
    animate("400ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
  ]),
])

export const growIn = trigger("growIn", [
  transition(":enter", [
    style({ transform: "scale(0.95)", opacity: 0 }),
    animate("300ms 100ms ease-out", style({ transform: "scale(1)", opacity: 1 })),
  ]),
])

export const listAnimation = trigger("listAnimation", [
  transition("* <=> *", [
    query(
      ":enter",
      [
        style({ opacity: 0, transform: "translateY(10px)" }),
        stagger("100ms", [animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))]),
      ],
      { optional: true },
    ),
  ]),
])
