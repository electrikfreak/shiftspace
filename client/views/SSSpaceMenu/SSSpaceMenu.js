// ==Builder==
// @uiclass
// @framedView
// @package           ShiftSpaceCoreUI
// @dependencies      SSFramedView
// ==/Builder==

/*
  Class: SSSpaceMenu
    The space menu that allows the users to select which space to run.
*/
var SSSpaceMenu = new Class({
  
  Extends: SSFramedView,
  name: 'SSSpaceMenu',


  initialize: function(el, options)
  {
    this.parent(el, options);

    SSAddObserver(this, 'onUserLogin', this.update.bind(this));
    SSAddObserver(this, 'onUserLogout', this.update.bind(this));
    SSAddObserver(this, 'onSpaceInstall', this.update.bind(this));
    SSAddObserver(this, 'onSpaceUninstall', this.update.bind(this));
    SSAddObserver(this, 'showSpaceMenu', this.show.bind(this));
    SSAddObserver(this, 'hideSpaceMenu', this.hide.bind(this));
  },
  
  
  awake: function(context)
  {
    this.mapOutletsToThis();
  },
  
  
  show: function()
  {
    this.parent();
    SSLog("SSSpaceMenu show!", SSLogForce);
    this.update();
    SSPostNotification('onSpaceMenuShow', this);
  }.decorate(ssfv_ensure),
  
  /*
    Function: resize
      *private*
      Resizes the space menu based on the number of installed spaces. Called
      on show and when the user install or uninstalls a space.
  */
  resize: function()
  {
    var body = this.contentWindow().$(this.contentDocument().body),
        ul = $(this.contentWindow().$('SpaceMenuList'));
    
    if(ul)
    {
      var n = ul.getElements('li').length;
      this.element.setStyles({
        height: (n * 31) + 7
      });
    }
  },
  
  
  hide: function()
  {
    this.element.addClass('SSDisplayNone');
    SSPostNotification('onSpaceMenuHide', this);
  },
  
  
  /*
    Function: onSpaceSort
      *private*
      Handles updating the internal list of installed spaces.
      
    See All:
      SSSetInstalledSpaces, SSInstalledSpaces
  */
  onSpaceSort: function()
  {
    var spaces = SSInstalledSpaces();
    var listItems = this.SpaceMenuList.cellNodes();
    
    var newSpaceOrder = listItems.map(function(el) {
      return {
        name:el.getElement('.name').get('text'), 
        position: listItems.indexOf(el)
      };
    });
  
    var newOrder = newSpaceOrder.map(function(obj) {
      return obj.name;
    });
    
    var oldOrder = [];
    $H(spaces).each(function(space) {
      return oldOrder[space.position] = space.name;
    });
    
    newSpaceOrder.each(function(newSpacePos) {
      spaces[newSpacePos.name].position = newSpacePos.position;
    });

   if(!newOrder.isEqual(oldOrder)) SSSetInstalledSpaces(spaces);
  },
  
  
  onInterfaceLoad: function(ui)
  {
    this.parent(ui);
    this.element.addClass('SSDisplayNone');
  }.future(),
  
  
  onContextActivate: function(context)
  {
    if(context == this.element.contentWindow)
    {
      this.mapOutletsToThis();
    }
  },
  

  attachEvents: function()
  {
    this.SpaceMenuList.addEvent('onSortComplete', this.onSpaceSort.bind(this));
    this.SpaceMenuList.addEvent('onRowSelect', this.newShift.bind(this));
    this.SpaceMenuList.addEvent('onReload', this.resize.bind(this));
    this.element.addEvent("mouseleave", this.hide.bind(this));
  },
  
  /*
    Function: newShift
      *private*
      Call into the ShiftSpace Core to create a new shift based on the user's
      selection.
      
    Parameters:
      index - the index of the space the user selected.
  */
  newShift: function(data)
  {
    if(ShiftSpace.User.isLoggedIn())
    {
      SSInitShift(SSSpaceForPosition(data.index));
    }
    else
    {
      alert("You must be logged in to create shifts!");
    }
    this.hide();
  },
  
  
  update: function()
  {
    if(this.isLoaded())
    {
      var spaces = SSSpacesByPosition();
      this.SpaceMenuList.setData(spaces);
      this.SpaceMenuList.refresh();
      if(this.isVisible())
      {
        this.resize();
      }
    }
  },

  
  buildInterface: function()
  {
    this.parent();
    this.update();
    this.attachEvents();
    this.setIsLoaded(true);
  },
  
  
  localizationChanged: function()
  {
    
  }
});