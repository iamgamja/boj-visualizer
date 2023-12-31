# BOJ Visualizer

[백준 온라인 저지](https://www.acmicpc.net/)의 문제를 시각화하는 프로젝트입니다. 백준 온라인 저지의 문제가 아니어도 시각화 할 수 있습니다.

## 기여 가이드

- [Git](https://git-scm.com/)과 [Node.js](https://nodejs.org/)를 설치해 주세요.
- [TypeScript](https://www.typescriptlang.org/)에 대한 지식이 필요합니다.

### 환경 세팅

1. 이 저장소를 포크해 주세요.

2. 포크한 저장소를 로컬에 클론해 주세요.

```bash
git clone <link>
```

3. 필요한 패키지를 설치해 주세요.

```bash
npm install
```

4. 다음 명령어를 실행 후 나오는 링크에 접속하면 작성한 내용을 실시간으로 확인할 수 있습니다.

```bash
npm run dev
```

### 시뮬레이션 코드 작성

- `/src/data/` 폴더에 새 typescript 파일(`.ts`)을 생성해 주세요. 이후 그 파일에 시뮬레이션 코드를 작성하면 됩니다.
- `../utils`에서 다음을 import할 수 있습니다.
  - `enum state`: 각 칸의 상태를 나타내는 enum입니다.
    - `Player`
    - `Block`
    - `Empty`
  - `Cell(y, x, state, value, board, N, M)`: 각 칸을 나타내는 클래스입니다. 다음 멤버 변수와 메서드에 접근할 수 있습니다.
    - `y: number`, `x: number`: 위에서 `y`번째, 왼쪽에서 `x`번째의 칸임을 나타냅니다. (0-index)
    - `state: state`: 이 칸의 상태입니다.
    - `value: any`: 이 칸에 다른 상태를 지정하려면 이 변수를 사용할 수 있습니다. (예시: 가중치 등)
    - `board: board`: 전체 board의 참조입니다.
    - `N: number`, `M: number`: board가 `N`행 `M`열임을 나타냅니다.
    - `canmove(y: number, x: number): boolean`: `(y, x)`로 이동할 수 있는지 여부를 반환합니다.
      - 이 칸과 `(y, x)`가 상하좌우로 인접하며, `(y, x)`의 state가 `Block`이 아니어야 합니다.
    - `move(y: number, x: number)`: `(y, x)`로 이동합니다.
      - 이 칸의 state가 `Player`이어야 하며, `(y, x)`로 이동 가능해야 합니다.
      - 이 칸의 state를 `Empty`로 하고 `(y, x)`의 state를 `Player`으로 합니다.
  - `deepcopy(board: board): board`: board를 깊은 복사하여 반환합니다.
  - `getPlayer(board): [y: number, x: number]`: state가 `Player`인 칸의 좌표를 반환합니다.
  - `type board = Cell[][]`
  - `type stepstype = ((board: board) => [board, number])[]`
  - `type datatype = { name: string; link: string; examples: string[] }`
- 다음 3개의 변수와 1개의 함수를 export해야 합니다.
  - `data: datatype`: 시뮬레이션의 정보를 담은 object입니다.
    - `name: string`: 시뮬레이션의 이름입니다. **다른 시뮬레이션과 중복되어서는 안됩니다.**
    - `link: string`: 문제의 링크입니다.
    - `examples: string[]`: 제공되는 예제 입력입니다.
  - `steps: stepstype`: 시뮬레이션의 각 단계를 구현한, 함수의 array입니다.
    - 각 함수는 `(board: board) => [board, number]` 타입입니다.
    - 반환하는 array의 첫번째 원소는 이 단계를 실행한 후의 board입니다.
    - 두번째 원소는 다음으로 실행할 단계의 index(0-index)입니다. 단, 시뮬레이션을 종료할 때는 -1입니다.
  - `stepNames: string[]`: 각 단계의 이름입니다.
  - `parseBoard: (s: string) => board`: 입력을 받아 board를 반환하는 함수입니다.
