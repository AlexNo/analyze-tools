{
  document.getElementById('har').addEventListener('blur', e => {
    let har = e.target.value;
    let defaultDomain = 'https://ggrc-qa.appspot.com';
    // let defaultDomain = 'http://localhost:8080';

    if (har) {
      let entries;
      let startTime;
      let totalTime;

      try {
        har = JSON.parse(har);
      } catch (e) {
        console.log('Invalid JSON');
        return;
      }
      entries = har.log.entries;

      let statsMap = entries.reduce((map, r) => {
        let endTime = new Date(r.startedDateTime).getTime() + r.time;
        let url = r.request.url.split('?')[0];

        if (!startTime || startTime > new Date(r.startedDateTime)) {
          startTime = new Date(r.startedDateTime);
        }

        if (!totalTime || totalTime < endTime - startTime.getTime()) {
          totalTime = endTime - startTime.getTime();
        }

        if (url.search(defaultDomain) > -1) {
          url = url.match(`${defaultDomain}(.*)`)[1];
          map.defaults.push({
            method: r.request.method,
            url,
            time: r.time
          });
        } else {
          map.other.push({
            method: r.request.method,
            url: 'other domains',
            time: r.time
          });
        }

        return map;
      }, {
        defaults: [],
        other: []
      });

      let stats = [...statsMap.defaults, statsMap.other
        .reduce((map, r) => {
          map.time += r.time;
          map.number += 1;
          map.method = `${map.number} requests`;
          return map;
        }, {
          method: '',
          url: 'other domains',
          time: 0,
          number: 0
        })];

      console.log('Total time:', totalTime);

      document.getElementById('stats').innerHTML = createStatsRows(stats);
      document.getElementById('total').innerHTML = totalTime;
    }
  });

  function createStatsRows(stats) {
    return stats.map(r => `<tr>
        <td>${r.method}</td>
        <td>${r.url}</td>
        <td>${r.time}</td></tr>`).join('');
  }
}