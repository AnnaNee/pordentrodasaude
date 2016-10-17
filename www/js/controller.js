angular.module('starter.controllers', [])

.run(function($ionicPlatform, GoogleMaps) {
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  }

  GoogleMaps.init();
})

.controller('IntroController', ['$scope', '$state', function($scope, $state) {
    $scope.step1 = {
      image: {
        url: 'img/logo.png',
        title: 'Logo Por Dentro da Saúde'
      },
      text: 'Bem vindo ao Por Dentro da Saúde! Com esse aplicativo, você pode avaliar ou verificar avaliações dos postos de atendimento do SUS.'
    };

    $scope.step2 = {
      image: {
        url: 'img/step2',
        title: 'Instruções de uso'
      },
      text: 'Seus dados estão protegidos. Suas avaliações são anônimas! Atribua notas ao atendimento e agilidade da Unidade.'
    };

    $scope.step3 = {
      text: 'Pronto para começar? Leia atentamente nossos Termos de Uso para prosseguir.',
      terms: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." <br /> "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid?',
        acceptText: 'Aceitar os Termos de Uso'
      }
    };

    $scope.step4 = {
      terms: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." <br /> "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid?',
        acceptText: 'Aceitar os Termos de Uso'
      }
    }

    $scope.wizard = {
      goBack: 'Voltar',
      goForward: 'Próximo',
      goApp: 'Começar'
    }

    $scope.start = function() {
      $state.go('login');
    };

    $scope.startCondition = function() {
        return angular.isDefined($scope.step4.terms.accept);
    };
}])

.controller('DashboardController', ['$scope', '$cordovaGeolocation', '$state', 'Markers', function($scope, $cordovaGeolocation, $state, Markers) {

}])

.controller('LoginController', ['$scope', 'LoginService', '$ionicPopup', '$state', function($scope, LoginService, $ionicPopup, $state) {
  $scope.loginData = {
    image: {
      url: 'img/logo.png',
      text: 'Logo Por Dentro da Saúde'
    },
    title: 'Login',
    username: 'Nome de usuário',
    password: 'Senha',
    signUp: {
      title: 'Cadastrar'
    },
    goBack: 'Voltar',
    send: 'Entrar',
  }

  $scope.data = {};

  $scope.login = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
      $state.go('tab.dashboard');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Falha ao fazer login',
        template: 'Login ou senha errados!'
      });
    });
  }

  $scope.signUp = function() {
    $state.go('sign-up');
  }

  $scope.goBack = function() {
    $state.go('main.intro');
  }
}])

.controller('SignUpController', ['$scope', '$state', '$cordovaGeolocation', function($scope, $state, $cordovaGeolocation) {
  $scope.signUpData = {
    title: 'Cadastrar',
    goBack: 'Voltar',
    send: 'Enviar',
    fullName: 'Nome e sobrenome',
    age: 'Idade',
    city: 'Cidade',
    state: 'UF',
    email: 'E-mail',
    password: 'Senha',
    adress: 'Digite seu endereço',
    information: 'As informações fornecidas são restritas e não serão divulgadas. Todas as avaliações realizadas no aplicativo são anônimas.'
  }

  $scope.goBack = function() {
    $state.go('login');
  }
}])

.controller('ReviewsController', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FaqController', function($scope) {

})

.controller('ProfileController', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
