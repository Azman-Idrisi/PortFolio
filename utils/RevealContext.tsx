"use client";

import { createContext, useContext } from "react";

// Create context for reveal animation coordination
interface RevealContextType {
  shouldReveal: boolean;
  triggerReveal: () => void;
}

const RevealContext = createContext<RevealContextType>({
  shouldReveal: false,
  triggerReveal: () => {},
});

export const useRevealContext = () => useContext(RevealContext);

export default RevealContext;
