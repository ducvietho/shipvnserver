var constants = {
    getAll: function () {
        return [
            {
                type: "group1",
                idGroup: "628810487239665",
                fbPath: "https://www.facebook.com/groups/shiptimnguoinguoitimship/",
                status: "private"
            },
            {
                type: "group2",
                idGroup: "797274217018415",
                fbPath: "https://www.facebook.com/groups/shipship/",
                status: "private"
            },
            {
                type: "group3",
                idGroup: "1732278763660669",
                fbPath: "https://www.facebook.com/groups/ShipS.vn/",
                status: "public"
            },
            {
                type: "group4",
                idGroup: "911657138855094",
                fbPath: "https://www.facebook.com/groups/shiptimnguoinguoitimshiphn/",
                status: "public"
            },
            {
                type: "group5",
                idGroup: "972384656134944",
                fbPath: "https://www.facebook.com/groups/shiptimgnguoihanoi/",
                status: "public"
            }]
    },
    getAccessToken:function(){
        return 'EAAQOqdyZBVqEBAPu59R67dJF3TfnxpwRE1tlWD58TVqylqINFJlUy6cwj6cr4o2aPLFdcOA79tpk5kJFBdNZCO2TdUyGaytyv5Jg7az92daZAZCwZBAf8BCoSBOqPjIB1C7p3k38Ud0ZCLumDsWU0JYgxtZCjqAwWkZD';
    },
    getPathApi:function(){
        return '/feed?fields=from,message,created_time&limit=1';
    },
    getVersion: function(type){
        if(type==='private'){
            return 'v2.3';
        }else{
            return 'v2.9';
        }
    }
};
module.exports = constants;