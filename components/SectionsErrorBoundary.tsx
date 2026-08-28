"use client";

import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class SectionsErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // swallow in dev; production build should never reach here
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
