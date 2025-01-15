import EditUserProfile from "@/features/setting/EditUserProfile";
import PageTemplate from "@/shared/original-ui/PageTemplate";

export default function Setting() {
  return (
    <PageTemplate>
      <div className="w-full md:max-w-xl mx-auto space-y-8">
        {/* 프로필 편집 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">프로필 편집</h2>
          <p className="text-sm text-muted-foreground">
            프로필 이미지, 닉네임을 편집할 수 있습니다.
          </p>
          <EditUserProfile />
        </div>

        {/* 소셜 로그인 연동 설정 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">소셜 로그인 연동 설정</h2>
          <p className="text-sm text-muted-foreground">
            소셜 로그인 연동 설정을 편집할 수 있습니다.
          </p>
        </div>

        {/* 약관 정책 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">약관 정책</h2>
          <p className="text-sm text-muted-foreground">
            약관 정책들을 확인할 수 있습니다.
          </p>
        </div>

        {/* 회원 탈퇴 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">회원 탈퇴</h2>
          <p className="text-sm text-muted-foreground">
            서비스에서 탈퇴하고 계정을 삭제합니다.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
