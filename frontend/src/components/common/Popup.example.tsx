/**
 * Popup Component Usage Examples
 * 
 * The Popup component is available globally through the PopupProvider.
 * Use the usePopup hook to show popups from anywhere in your application.
 */

"use client";

import { usePopup } from './PopupProvider';
import Button from './Button';

// Example 1: Basic usage in a component
export function ExampleComponent() {
  const { showSuccess, showError, showWarning, showInfo } = usePopup();

  return (
    <div className="space-x-4">
      <Button onClick={() => showSuccess('Operation completed successfully!')}>
        Show Success
      </Button>
      
      <Button onClick={() => showError('Something went wrong!')}>
        Show Error
      </Button>
      
      <Button onClick={() => showWarning('Please check your input')}>
        Show Warning
      </Button>
      
      <Button onClick={() => showInfo('Here is some information')}>
        Show Info
      </Button>
    </div>
  );
}

// Example 2: Advanced usage with options
export function AdvancedExample() {
  const { showPopup } = usePopup();

  const handleCustomPopup = () => {
    showPopup(
      'This is a custom popup message',
      'success',
      {
        title: 'Custom Title',
        duration: 3000, // Auto-close after 3 seconds (0 = no auto-close)
        position: 'bottom-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
      }
    );
  };

  return (
    <Button onClick={handleCustomPopup}>
      Show Custom Popup
    </Button>
  );
}

// Example 3: Using in async operations
export function AsyncExample() {
  const { showSuccess, showError } = usePopup();

  const handleAsyncOperation = async () => {
    try {
      // Your async operation
      await fetch('/api/data');
      showSuccess('Data loaded successfully!');
    } catch (error) {
      showError('Failed to load data');
    }
  };

  return (
    <Button onClick={handleAsyncOperation}>
      Load Data
    </Button>
  );
}
