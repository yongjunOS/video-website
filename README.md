# Video Streaming Service (VSS)
#### 제작기간 : 2024.6.1 ~ 2024.7.10
인원 : 5명 

## 주요 기능

- **사용자 관리**: 회원가입, 로그인, 프로필 관리
- **비디오 업로드 및 관리**: 사용자는 비디오를 업로드하고 관리할 수 있습니다
- **재생목록**: 사용자는 좋아하는 비디오로 재생목록을 만들고 관리할 수 있습니다
- **댓글 시스템**: 비디오에 대한 사용자 상호작용을 위한 댓글 기능
- **결제 시스템**: 프리미엄 기능에 대한 결제 처리

## 담당기능
- **재생목록 CRUD**
### 1. 다대다 관계 처리

- **오류:** VIDEO와 PLAYLIST 사이의 복잡한 다대다 관계를 효율적으로 관리해야 했습니다.

- **해결:**
  - `PLAYLIST_VIDEOS`라는 중간 테이블을 도입하여 다대다 관계를 명확하게 표현했습니다.
  - JPA의 `@ManyToMany` 어노테이션과 `@JoinTable`을 사용하여 관계를 매핑했습니다.
  - 이를 통해 데이터 무결성을 유지하면서도 유연한 재생목록 관리가 가능해졌습니다.

## 기술 스택

### 백엔드
- Java
- Spring Boot
- JPA/Hibernate
- Oracle

### 프론트엔드
- React
- Bootstrap

### 기타 도구 및 라이브러리
- Gradle
- log4j
- JavaMailSender (이메일 서비스)
- IamportClient (결제 시스템)

## ERD (Entity Relationship Diagram)
![Untitled diagram-2024-09-01-113458](https://github.com/user-attachments/assets/a3f6c67e-826b-431c-a2e1-5be4ce13a31e)



이 ERD는 VSS의 주요 엔티티와 그들 사이의 관계를 보여줍니다. 회원(MEMBER)은 비디오를 업로드하고, 재생목록을 만들며, 결제 내역을 가지고 있습니다. 비디오(VIDEO)는 댓글을 가질 수 있으며, 재생목록(PLAYLIST)에 포함될 수 있습니다.

