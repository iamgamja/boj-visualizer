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

4. 다음 명령어를 실행 후 나오는 링크에 접속하면 작성한 내용을 실시간으로 확인할 수 있습니다. (`.ts` 파일을 수정했다면 새로고침을 해야 합니다.)

```bash
npm run dev
```

### 시뮬레이션 코드 작성

- `/src/data/` 폴더에 새 typescript 파일(`.ts`)을 생성해 주세요. 이후 그 파일에 시뮬레이션 코드를 작성하면 됩니다.
- `../utils`에서 다음을 import할 수 있습니다.
  - `enum State`: 각 칸의 상태를 나타내는 enum입니다.
    - `Block`, `Item`, `Empty`
  - `enum Direction`: 방향을 나타내는 enum입니다.
    - `Up`, `Down`, `Left`, `Right`
  - `dd: Record<Direction, [y: number, x: number]>`: 방향마다 y, x좌표에 더해지는 상수입니다.
    - 예시: `dd[Direction.Up] = [-1, 0]`
  - `Cell(state, {value, text}?)`: 각 칸을 나타내는 클래스입니다.
    - `state: state`: 이 칸의 상태입니다.
    - `value: any`: 이 칸에 다른 상태를 지정하려면 이 변수를 사용할 수 있습니다. (예시: 가중치 등)
    - `text: string`: 이 칸에 적힐 문자열입니다.
    - `copy()`: 복사본을 반환합니다.
  - `Board(N, M, {value, text}?)`: 전체 격자를 나타내는 클래스입니다.
    - `N: number`, `M: number`: 격자가 `N`행 `M`열임을 나타냅니다.
    - `value: any`: 전체 격자에 다른 상태를 지정하려면 이 변수를 사용할 수 있습니다. (예시: 플레이어가 획득한 아이템 등)
    - `text: (board: Board) => string`: 시뮬레이션 중 보일 문자열을 반환하는 함수입니다.
    - `grid: Cell[][]`: `N`행 `M`열의 2차원 Array입니다. **parseBoard 함수에서 초기화해야 합니다.**
    - `player: {y: number, x: number}`: 플레이어의 위치입니다. **parseBoard 함수에서 초기화해야 합니다.**
    - `playerCell`: `grid[player.y][player.x]`의 별칭입니다.
    - `canmove(direction, {start, c}?)`
      - `start`에서 `direction` 방향으로 이동할 수 있는지 여부를 반환합니다.
      - `start`를 지정하지 않으면 `player`을 사용합니다.
      - `N*M`의 범위를 벗어나지 않으며, `state`가 `Block`이 아니어야 합니다.
      - `c`가 주어지면, `c(현재 칸, 이동할 칸)`을 추가로 만족해야 합니다.
    - `move(direction, {cb}?)`
      - `player`를 direction 방향으로 이동합니다.
      - `cb`가 주어지면, `cb(처음 칸, 이동한 칸)`을 실행합니다.
    - `bfs(target, {start, order, c}?)`
      - `start`에서 시작해 `target(cell)`을 만족하는 칸 중 가장 가까운 칸의 좌표와 거리를 반환합니다. 도달할 수 없다면 `null`을 반환합니다.
      - `start`를 지정하지 않으면 `player`을 사용합니다.
      - 이동은 `canmove`를 만족해야 합니다. `c`가 주어지면 `c`를 추가로 만족해야 합니다.
      - bfs에서 시도하는 방향의 순서는 `order`을 사용합니다. 기본값은 `[Up, Left, Right, Down]`입니다.
    - `getDistance(target, {start, c}?)`
      - `bfs`를 사용해 거리를 반환합니다. 도달할 수 없다면 `null`을 반환합니다.
    - `findDirection(target, {start, order, c}?)`
      - `start`에서 `target(cell)`을 만족하는 칸 중 가장 가까운 칸으로 갈 때, 어느 방향으로 가야 하는지 반환합니다.
      - `start`를 지정하지 않으면 `player`을 사용합니다.
      - 이동은 `canmove`를 만족해야 합니다. `c`가 주어지면 `c`를 추가로 만족해야 합니다.
      - 가능한 방향이 여러 개 있다면, `order`에서 앞에 위치하는 방향을 반환합니다. 기본값은 `[Up, Left, Right, Down]`입니다.
    - `copy()`: 복사본을 반환합니다.
- 다음 3개의 변수와 1개의 함수를 export해야 합니다.
  - `data: datatype`: 시뮬레이션의 정보를 담은 object입니다.
    - `name: string`: 시뮬레이션의 이름입니다. **다른 시뮬레이션과 중복되어서는 안됩니다.**
    - `link: string`: 문제의 링크입니다.
    - `examples: string[]`: 제공되는 예제 입력입니다.
  - `steps: stepstype`: 시뮬레이션의 각 단계를 구현한 함수의 array입니다.
    - 각 함수는 `(board: Board) => [Board, number]` 타입입니다.
    - 반환하는 array의 첫번째 원소는 이 단계를 실행한 후의 board입니다.
    - 두번째 원소는 다음으로 실행할 단계의 index(0-index)입니다. 단, 시뮬레이션을 종료할 때는 -1입니다.
  - `stepNames: string[]`: 각 단계의 이름입니다.
  - `parseBoard: (s: string) => Board`: 입력을 받아 Board를 반환하는 함수입니다.
