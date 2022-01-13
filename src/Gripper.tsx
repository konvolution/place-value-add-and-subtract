export function Gripper({ enabled = true }: { enabled?: boolean }) {
  return (
    <div className="Gripper">
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 1 12"
        style={{
          visibility: enabled ? "visible" : "hidden",
          maxWidth: 50,
          width: "75%",
          height: 10
        }}
      >
        <rect y="0" width="1" height="1" fill="grey" />
        <rect y="1" width="1" height="1" fill="lightgrey" />
        <rect y="4" width="1" height="1" fill="grey" />
        <rect y="5" width="1" height="1" fill="lightgrey" />
        <rect y="8" width="1" height="1" fill="grey" />
        <rect y="9" width="1" height="1" fill="lightgrey" />
      </svg>
    </div>
  );
}
