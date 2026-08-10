// Maps low-level Vapi SDK errors to user-facing copy.
export function mapVapiError(error: Error): string {
    const message = error.message?.toLowerCase() || '';

    if (message.includes('timeout') || message.includes('silence')) {
        return 'Session ended due to inactivity. Click the mic to start again.';
    }

    if (message.includes('network') || message.includes('connection')) {
        return 'Connection lost. Please check your internet and try again.';
    }

    return 'Session ended unexpectedly. Click the mic to start again.';
}
