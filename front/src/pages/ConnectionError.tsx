export default function ConnectionError() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen text-center">
      <h2 className="text-4xl font-bold">네트워크 연결 오류</h2>
      <p className="text-xl text-muted-foreground">
        네트워크 연결 상태를 확인해주세요.
      </p>
    </div>
  );
}
