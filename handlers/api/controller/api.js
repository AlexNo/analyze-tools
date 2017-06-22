const config = require('config');
const rp = require('request-promise');
const url = require('url');

exports.status = async (ctx, next) => {
  ctx.body = `${config.app.name} status: UP!`;
};

exports.prs = async (ctx, next) => {
  let id = ctx.params.id;

  let gh = await getCommitsByPage(id, 1, true);
  let lastPage = getLastPage(gh.headers.link);
  let pages = [];
  let merges = filterMergeCommits(JSON.parse(gh.body));

  for (let i = 1; i < lastPage; i) {
      pages.push(getCommitsByPage(id, ++i));
  }

  let commits = await Promise.all(pages);

  commits.forEach(c => {
      merges = [...merges, ...filterMergeCommits(c)];
  });

  let prs = merges.map(c => c.commit.message).map(m => m.match(/\d{4}/)[0]);

  let pulls = await Promise.all(prs.map(pr => getIssue(pr)));


  console.log(pulls.map(p => p.title));

  let jiraUrl = `https://gojira.corp.google.com/browse/GGRC-${prs[0]}?jql=project=GGRC and id in(${prs.map(n => 'GGRC-' + n).join(',')})`;

  console.log(jiraUrl);

  ctx.body = pulls;
};

function parseLinkHeader(header) {
    // Split parts by comma
    let parts = header.split(',');
    let links = {};
    // Parse each part into a named link
    parts.forEach(function(p) {
        let section = p.split(';');
        if (section.length != 2) {
            throw new Error("section could not be split on ';'");
        }
        let url = section[0].replace(/<(.*)>/, '$1').trim();
        let name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    });

    return links;
}

function getLastPage(headers) {
    let links = parseLinkHeader(headers);

    return url.parse(links.last, true).query.page;
}

function filterMergeCommits(commits) {
    return commits.filter(c => c.commit.committer.name === 'GitHub');
}


async function getCommitsByPage(pr, page, full) {
    let options = {
        uri:`https://api.github.com/repos/google/ggrc-core/pulls/${pr}/commits`,
        qs: {
            per_page: 100,
            page
        },
        headers: {
            'User-Agent': 'GGRC-stats'
        }
    };

    if (full) {
        options.resolveWithFullResponse = true;
    } else {
        options.json = true;
    }

    return rp(options);
}

async function getIssue(number) {
    let options = {
        uri:`https://api.github.com/repos/google/ggrc-core/issues/${number}`,
        headers: {
            'User-Agent': 'tests'
        }
    };

    console.log('Issue number', number);

    return rp(options);
}