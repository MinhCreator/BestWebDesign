export default function Loading() {
  return (
    // right side news loading placeholder
    <div class="rounded-lg p-4 bg-gray-100 animate-pulse max-w-sm mx-auto mt-1">
    <div class="flex space-x-4 py-6">
        <div class="rounded-full bg-gray-200 h-12 w-12"></div>
        <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="space-y-2">
                <div class="h-4 bg-gray-300 rounded"></div>
                <div class="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
        </div>
    </div>
</div>
  );
}
