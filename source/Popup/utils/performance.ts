const enableDevLogging = false;

// Performance monitoring utility for tab switching
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private tabSwitchTimes: Map<string, number> = new Map();
  private lastTabSwitch: number = 0;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTabSwitch(tabId: string): void {
    this.lastTabSwitch = performance.now();
    this.tabSwitchTimes.set(tabId, this.lastTabSwitch);
  }

  endTabSwitch(tabId: string): number {
    const startTime = this.tabSwitchTimes.get(tabId);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.tabSwitchTimes.delete(tabId);

    // Log performance data in development
    if (process.env.NODE_ENV === 'development' && enableDevLogging) {
      console.log(`Tab switch to ${tabId} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getAverageSwitchTime(): number {
    // This would be implemented if you want to track average performance
    return 0;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook for measuring tab switch performance
export const useTabSwitchPerformance = () => {
  const startSwitch = (tabId: string) => {
    performanceMonitor.startTabSwitch(tabId);
  };

  const endSwitch = (tabId: string) => {
    return performanceMonitor.endTabSwitch(tabId);
  };

  return { startSwitch, endSwitch };
};
