const parser = (response) => {
  const domParser = new DOMParser();
  const data = domParser.parseFromString(response.data.contents, 'application/xml');
  const parseError = data.querySelector('parsererror');
  if (parseError) {
    throw new Error('notRss');
  }

  const channel = data.querySelector('channel');
  const titleChannel = channel.querySelector('title').textContent;
  const descriptionChannel = channel.querySelector('description').textContent;
  const feed = { titleChannel, descriptionChannel };

  const itemElements = channel.getElementsByTagName('item');
  const posts = Array.from(itemElements).map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return {
      title,
      description,
      link,
    };
  });

  const parseResult = { feed, posts };
  return parseResult;
};

export default parser;
