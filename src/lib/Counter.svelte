<script>
  import {getTraindata} from '../../db_api/db_api.js';
  let count = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={getTraindata}>
  count is {count}
</button>
