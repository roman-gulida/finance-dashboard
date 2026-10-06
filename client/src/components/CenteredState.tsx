type CenteredStateProps = {
  children: React.ReactNode;
};

export function CenteredState({ children }: CenteredStateProps) {
  return <div className="flex items-center justify-center w-full h-full min-h-50">{children}</div>;
}
