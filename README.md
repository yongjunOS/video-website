# JAVABOJA Final Project

### 프로젝트 주제 : 분산 환경 MSA 아키텍처의 동영상 스트리밍 서버 웹 솔루션 개발<br>

#### PM - 권동빈<br>

#### PL - 이준경<br>

#### PA - 김용준<br>

#### PA - 유성욱<br>

#### DBA - 정민성<br>

---

### 역할분담 및 프로젝트계획
<img width="1111" alt="image" src="https://github.com/user-attachments/assets/9277b467-48d4-43c2-aba9-f9a9d9a0e233">



---

### 선정배경 
동영상 콘텐츠 소비가 꾸준히 증가하고, 
안정적이며 고성능의 스트리밍 서비스에 대한 수요가 높아짐에 따라 
이를 위해 분산환경에서 효율적으로 동영상 스트리밍을 제공하는 서비스를 개발
<br>

---

### 프로젝트 개요
-사용자 경험 향상  :  개인화된 재생목록 기능으로 사용자의 콘텐츠 관리 편의성 증대
-직관적인 인터페이스를 통한 동영상 공유 및 시청 경험 개선
-커뮤니티 활성화: 댓글 시스템을 통한 사용자 간 상호작용 촉진
-좋아요 기능으로 인기 콘텐츠 식별 용이
-확장성 및 유지보수성: 모듈화 된 구조로 향후 기능 추가 및 확장이 용이
-계층화 된 아키텍처로 각 부분의 독립적인 개선 및 유지보수 가능

---


### 개발환경
<img width="1109" alt="image" src="https://github.com/user-attachments/assets/dacdbd41-fe32-476d-ae66-52fbc87734bc">

---

### 개발 구조

#### 프론트엔드
-React.js를 사용하여 동적이고 반응형 사용자 인터페이스 구현<br>
-동영상 플레이어 컴포넌트 구현<br>
-재생목록 관리 인터페이스 개발<br>
-사용자 프로필 및 설정 페이지 구현<br>
#### 백엔드
-Spring Boot 3 기반의 RESTful API 서버 구축<br>
-MSA 패턴을 적용한 계층적 구조 설계<br>
-비디오 스트리밍 및 파일 업로드 처리 로직 구현<br>
-사용자 인증 및 권한 관리 시스템 구축<br>
#### 데이터베이스
-Oracle 21C를 사용한 데이터 관리 및 저장<br>
-비디오 메타데이터, 사용자 정보, 재생목록, 댓글 등의 데이터 모델 설계<br>
-JPA와 Hibernate를 활용한 객체-관계 매핑 구현<br>
#### 외부 API
-결제 시스템 (포트원)<br>

---

### 프로젝트 결과
1. 기술 스택 통합: Spring Boot 3와 React 통합하여  현대적이고 효율적인 웹 애플리케이션 구축<br>
2. Oracle 21C 데이터베이스와의 원활한 연동 구현<br>
3. 핵심 기능 구현: 동영상 업로드, 스트리밍, 재생목록 관리 등 주요 기능 성공적 구현<br>
4. 사용자 인증 및 권한 관리 시스템 구축<br>
5. 효율적인 데이터베이스 쿼리 설계로 응답 시간 개선<br>
6. 동영상 스트리밍 최적화로 사용자 경험 향상<br>

---
### 실제페이지
시연영상 링크 : https://youtu.be/rSLJxi2lX6w
#### 로그인 페이지
<img width="1439" alt="image" src="https://github.com/user-attachments/assets/4cbd0a83-bd09-4a04-8cd8-4a4d63605208">

#### 동영상 페이지
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/7960edac-0e53-475e-b3c7-f373b578b7fe">

#### 재생목록 페이지
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/b7c46a6b-7940-4da1-ac68-836fa79bafc2">


#### 결제 페이지

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/f76cb102-087a-4fc0-9f38-c256d40f5f7d">

#### 문의 게시판
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/a747e924-1669-4ac9-8263-1874cd37bb1c">







### 향후 계획
1. 보안 강화 계획<br>
정기적인 보안 감사 실시 및 취약점 대응 체계 구축<br>
데이터 암호화 범위 확대 및 보안 프로토콜 최신화<br>

2. 확장성 개선<br>
대규모 트래픽 처리를 위한 서버 아키텍처 최적화<br>

3. 사용자 경험 개선<br>
베타 테스트 피드백을 반영한 UI/UX 개선<br>
사용자 행동 분석을 통한 서비스 최적화<br>

4. 클라우드 배포<br>
AWS를 이용한 프로젝트 배포 실시<br>

