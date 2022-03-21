interface AstOutputProps {
  code: string;
}

export const AstOutput: React.FC<AstOutputProps> = ({ code }) => {
  return (
    <div>{JSON.stringify(code)}</div>
  );
}