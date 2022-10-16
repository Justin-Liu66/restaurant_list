function sortSelector(sort) {
  switch (sort) {
    case 'name_asc':
      return { name: 'asc' }
    case 'name_desc':
      return { name: 'desc' }
    case 'category':
      return { category: 'asc' }
    case 'location':
      return { location: 'asc' }
  }
}

module.exports = sortSelector