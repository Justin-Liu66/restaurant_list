function sortSelector(sort) {
  /* 方法一
  switch (sort) {
    case 'name_asc':
      return { name: 'asc' }
    case 'name_desc':
      return { name: 'desc' }
    case 'category':
      return { category: 'asc' }
    case 'location':
      return { location: 'asc' }
  } */
  //方法二
  const [property, sortBy] = sort.split('_')
  return { [property]: sortBy }
}
module.exports = sortSelector


//sort = 'name_asc'
//const [property, sortBy] = sort.split('_')
//['name', 'asc']
//property = 'name' sortBy='asc'
