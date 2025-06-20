export default function Loader() {
  return (
    <div className="p-3">
      <div className="flex gap-4">
        <div className="w-[116px] h-[116px] rounded-lg skeleton-image"></div>
        <div>
          <div className="h-[15px] w-[100px] skeleton-title"></div>
          <div className="h-[15px] mt-3 w-[100px] skeleton-description"></div>
        </div>
      </div>
    </div>
  );
}
