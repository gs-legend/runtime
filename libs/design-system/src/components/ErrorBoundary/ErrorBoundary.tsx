import { Component, ReactNode } from 'react';
import './index.less';

type Props = {
  children: ReactNode;
};

type State = Readonly<{
  hasError: boolean;
}>;

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: string) {
    console.log(error);
    return { hasError: true };
  }

  override readonly state: State = {
    hasError: false,
  };

  override render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? (
      <div className="errorboundary_screen">
        <div>
          <h1>Unexpected Error</h1>
          <p>This is a problem.</p>
          <p>
            <button onClick={() => window.location.reload()}>Reload</button>
          </p>
        </div>
      </div>
    ) : (
      children
    );
  }
}
