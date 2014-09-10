function PageCtrl($scope, $sce) {
  $scope.parseMarkdown = function(markdown) {
    if (!markdown)
      return '';
    return $sce.trustAsHtml(marked(markdown));
  };
}