/**
 * Created by joseant on 10/09/15.
 */
var BoardModel = require('../../models/boards_model');

describe("Board Model", function () {
    it("saveValue shall overwrite previous value", function (done) {
        var boardModel = BoardModel.boardModel;
        boardModel.find({}, function (err, data) {
            if (data) {
                BoardModel.saveValue(data[0], data[0].sensors[0], '5.5', function (err) {
                    if (!err)
                        done();
                });
            }
        });
    });

    it("findSensorByBoardAndId shall return a unique sensor", function (done) {
        //spyOn(BoardModel,'findSensorByBoardAndId').and.callThrough();
        BoardModel.findSensorByBoardAndId('1', '282ddbaf020000b0', function (err, result) {
            if (result)
                if (result.code === '282ddbaf020000b0')
                    done();
        });
    });

    it("findSensorByBoardAndId shall return null when invalid sensor", function (done) {
        BoardModel.findSensorByBoardAndId('1', '282ddbaf0200kkb0', function (err, result) {
            if (!result)
                done();
        });
    });


    //xit("get /boards", function () {
    //    var response;
    //    //spyOn(boardController.get('/boards'), 'res').and.callThrough();
    //    console.log(boardController.get('/boards').res);
    //});
});