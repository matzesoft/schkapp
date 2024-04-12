<script>
  import {getTraindata} from '../../dbAPI_test.js';
  let count = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={getTraindata}>
  count is {count}
</button>
