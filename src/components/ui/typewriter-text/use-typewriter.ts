import { useEffect, useReducer, useRef, useCallback } from "react";

type Phase = "idle" | "startDelay" | "typing" | "pauseBeforeDelete" | "deleting" | "pauseBeforeNext" | "done";
export type TypewriterDirection = "in" | "out";

interface State {
  phase: Phase;
  textIndex: number;
  charIndex: number;
  displayText: string;
}

type Action =
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "TYPE_CHAR"; char: string }
  | { type: "DELETE_CHAR" }
  | { type: "NEXT_TEXT"; textIndex: number }
  | { type: "RESET"; displayText?: string; charIndex?: number; textIndex?: number; phase?: Phase };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "TYPE_CHAR":
      return {
        ...state,
        displayText: state.displayText + action.char,
        charIndex: state.charIndex + 1,
      };
    case "DELETE_CHAR":
      return {
        ...state,
        displayText: state.displayText.slice(0, -1),
        charIndex: state.charIndex - 1,
      };
    case "NEXT_TEXT":
      return {
        ...state,
        textIndex: action.textIndex,
        charIndex: 0,
        displayText: "",
      };
    case "RESET":
      return {
        phase: action.phase ?? "idle",
        textIndex: action.textIndex ?? 0,
        charIndex: action.charIndex ?? 0,
        displayText: action.displayText ?? "",
      };
    default:
      return state;
  }
}

export interface UseTypewriterOptions {
  texts: string[];
  typingSpeed: number;
  deletingSpeed: number;
  pauseBeforeDelete: number;
  pauseBeforeNext: number;
  startDelay: number;
  direction: TypewriterDirection;
  loop: boolean;
  shouldAnimate: boolean;
  restartKey?: string | number;
  onTypingStart?: () => void;
  onTypingComplete?: (value: string) => void;
  onDeleteComplete?: (value: string) => void;
  onCycleComplete?: (index: number) => void;
}

export function useTypewriter(options: UseTypewriterOptions) {
  const {
    texts,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBeforeNext,
    startDelay,
    direction,
    loop,
    shouldAnimate,
    restartKey,
    onTypingStart,
    onTypingComplete,
    onDeleteComplete,
    onCycleComplete,
  } = options;

  const [state, dispatch] = useReducer(reducer, {
    phase: "idle",
    textIndex: 0,
    charIndex: 0,
    displayText: "",
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbacksRef = useRef({ onTypingStart, onTypingComplete, onDeleteComplete, onCycleComplete });
  callbacksRef.current = { onTypingStart, onTypingComplete, onDeleteComplete, onCycleComplete };

  const textsRef = useRef(texts);
  textsRef.current = texts;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  // Reset when texts change, animation preference changes, or restartKey changes
  useEffect(() => {
    clearTimer();
    if (!shouldAnimate) {
      const currentText = texts[0] ?? "";
      dispatch({
        type: "RESET",
        displayText: direction === "out" ? "" : currentText,
        charIndex: direction === "out" ? 0 : currentText.length,
        textIndex: 0,
        phase: "done",
      });
      return;
    }
    const currentText = texts[0] ?? "";
    dispatch({
      type: "RESET",
      displayText: direction === "out" ? currentText : "",
      charIndex: direction === "out" ? currentText.length : 0,
      textIndex: 0,
      phase: "startDelay",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts.join("\x00"), shouldAnimate, direction, clearTimer, restartKey]);

  // State machine
  useEffect(() => {
    if (!shouldAnimate) return;
    clearTimer();

    const currentText = textsRef.current[state.textIndex] ?? "";
    const isMultiple = textsRef.current.length > 1;

    switch (state.phase) {
      case "startDelay":
        timerRef.current = setTimeout(() => {
          callbacksRef.current.onTypingStart?.();
          dispatch({ type: "SET_PHASE", phase: direction === "out" ? "deleting" : "typing" });
        }, startDelay);
        break;

      case "typing":
        if (state.charIndex < currentText.length) {
          timerRef.current = setTimeout(() => {
            dispatch({ type: "TYPE_CHAR", char: currentText[state.charIndex] });
          }, typingSpeed);
        } else {
          callbacksRef.current.onTypingComplete?.(currentText);
          if (isMultiple) {
            const isLast = state.textIndex === textsRef.current.length - 1;
            if (!isLast || loop) {
              dispatch({ type: "SET_PHASE", phase: "pauseBeforeDelete" });
            } else {
              dispatch({ type: "SET_PHASE", phase: "done" });
            }
          } else {
            if (loop) {
              dispatch({ type: "SET_PHASE", phase: "pauseBeforeDelete" });
            } else {
              dispatch({ type: "SET_PHASE", phase: "done" });
            }
          }
        }
        break;

      case "pauseBeforeDelete":
        timerRef.current = setTimeout(() => {
          dispatch({ type: "SET_PHASE", phase: "deleting" });
        }, pauseBeforeDelete);
        break;

      case "deleting":
        if (state.charIndex > 0) {
          timerRef.current = setTimeout(() => {
            dispatch({ type: "DELETE_CHAR" });
          }, deletingSpeed);
        } else {
          const deletedText = textsRef.current[state.textIndex] ?? "";
          callbacksRef.current.onDeleteComplete?.(deletedText);
          callbacksRef.current.onCycleComplete?.(state.textIndex);

          if (direction === "out") {
            dispatch({ type: "SET_PHASE", phase: "done" });
            break;
          }

          if (isMultiple) {
            const nextIndex = (state.textIndex + 1) % textsRef.current.length;
            dispatch({ type: "NEXT_TEXT", textIndex: nextIndex });
            dispatch({ type: "SET_PHASE", phase: "pauseBeforeNext" });
          } else {
            // single text loop
            dispatch({ type: "NEXT_TEXT", textIndex: 0 });
            dispatch({ type: "SET_PHASE", phase: "pauseBeforeNext" });
          }
        }
        break;

      case "pauseBeforeNext":
        timerRef.current = setTimeout(() => {
          callbacksRef.current.onTypingStart?.();
          dispatch({ type: "SET_PHASE", phase: "typing" });
        }, pauseBeforeNext);
        break;

      case "idle":
      case "done":
        break;
    }

    return clearTimer;
  }, [
    state.phase,
    state.charIndex,
    state.textIndex,
    shouldAnimate,
    direction,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBeforeNext,
    startDelay,
    loop,
    clearTimer,
  ]);

  const fullText = texts[state.textIndex] ?? "";

  return {
    displayText: state.displayText,
    fullText,
    phase: state.phase,
    isTyping: state.phase === "typing" || state.phase === "deleting",
    isDone: state.phase === "done",
  };
}
