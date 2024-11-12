import React, { Component, ErrorInfo } from 'react';
import { Flex } from 'styles';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error: ', error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      return (
        <Flex justify="center" align="center" height="100%" direction="column">
          <h1 style={{ textAlign: 'center' }}>
            {t('components.errorBoundary.heading1')}
          </h1>
          <h2>Please refresh</h2>
        </Flex>
      );
    }

    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
