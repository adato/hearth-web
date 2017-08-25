angular.module('hearth.controllers').controller('GiftCategorizationController', ['$q', 'Post', function($q, Post) {

  const ctrl = this
  ctrl.loaded
  ctrl.searching

  const defaults = {
    type: 'post',
    limit: 15,
    offset: 0
  }

  ctrl.search = search
  ctrl.listOptions = new ListOptions()

  ctrl.data = []
  ctrl.query = ''

  init()

  /////////////////

  function init() {
    $q.all({
      posts: getPosts()
    }).then(res => {
      ctrl.data = res.posts
    }).catch(err => {
      console.log('err', err)
    }).finally(() => {
      ctrl.loaded = true
    })
  }

  function getPosts({ query } = {}) {
    ctrl.searching = true
    return $q((resolve, reject) => {
      Post.query(angular.merge({ query }, defaults)).$promise.then(res => {
        return resolve(res.data)
      }).catch(reject).finally(() => ctrl.searching = false)
    })
  }

  function search({ query } = {}) {
    getPosts({ query }).then(posts => {
      ctrl.data = posts
    }).catch(err => {
      console.log('err searching', err)
    })
  }

  function ListOptions() {
    this.disableLoading = false
    this.getParams = {}
    this.getData = params => $q(r => r(ctrl.data))
    // this.templateUrl = 'assets/components/post/posts/post.html'
    this.templateUrl = 'assets/pages/admin/templates/giftCatPost.html'
    this.bindToScope = {
      loadCategories: query => {
        return $q((resolve, reject) => {
          var data = [];
          Post.loadCategories({ q: query}).$promise.then (res => {
            // console.log(res.data)
            data = res.data.map(item => ({title: item}))
            //console.log ('before resolve:', data)
            data = resolve(data)
            //console.log ('resolved:', data)
          }).catch(err => {
            console.log('caught', err)
          })
          return data
          // return resolve([
          //   {title: 'Tohle'},
          //   {title: 'je jenom'},
          //   {title: 'muj mock'},
          // ])

        })
      },
      saveStatus: null,
      saveCategories: ({ post, categories }) => {
        // console.log('saving categories of id:', post._id, 'categories:', categories);
        Post.updateCategories({postId: post._id}, { categories: categories.map(c => c.title) }).$promise.then(res => {
          // console.log('ok')
        }).catch(err => {
          console.log('caught', err)
        })

      }
    } // object that will be merged to post scope
    // this.cb = console.info
  }

}])

