
# 배경
Scheme 과 데이터가 N : N 관계에 있을때,
이를 검증하는 2가지 방법에 대한 예시 프로그램을 만들어봅니다.

# 환경 구성
```
# node 14.16.1
nvm use

npm ci

# Schema 파일을 특정할 수 있는 검증 방법
npm run single

# Schema 파일을 특정할 수 없는 검증 방법
npm run bulk
```

# 정리
- bulk : 모든 Schema 들을 병합하여 특정 data.json 이 valid 한지 여부만 판단할 수 있습니다.
  - 장점
    - 개별적으로 비교하지 않아도 되어 처리 시간이 단축될 수 있다.
    - 매핑 파일이 필요하지 않다.
  - 단점: 개별 Schema 들이 복잡하게 구성되어있다면 `mergeSchemes` 함수가 훨씬 복잡하게 구현되어야 한다.
  
- single: 특정 data.json 을 기준으로 일치하는 Schema 를 찾습니다.
  - 장점: 매핑 파일이 필요하지 않다.
  - 단점: 일치하지 않는 Schema 도 모두 validate 함수 호출
  
Data, Schema 모두에 ID 를 넣고 이를 data-schema 상호 식별기준으로 삼을 경우
- 장점
  - data.json 만 보고 이 데이터가 어떤 Schema 를 따라야 하는지 알 수 있다.
    - 처음 해당 코드들을 접한 사람도 직관적으로 아 이게 schema 를 바라보겠구나 추측할 수 있다. (아마도?) 
- 단점: ?

# 결론
함부로 훈수두지말것 ... 껄껄
