import React from "react";

const Progress = React.forwardRef(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => (
    <div
      ref={ref}
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      {...props}
    >
      <div
        className={`h-full w-full flex-1 bg-blue-600 transition-all ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </div>
  )
);

Progress.displayName = "Progress";

export { Progress };
