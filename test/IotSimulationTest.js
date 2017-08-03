var IotSimulation = artifacts.require("./IotSimulation.sol");
var SmartAsset = artifacts.require("./SmartAsset.sol");
var CarAssetLogic = artifacts.require("./CarAssetLogic.sol");

function toAscii(input) {
    return web3.toAscii(input).replace(/\u0000/g, '');
}

contract('IotSimulation', function(accounts) {

    it("Should update params of SmartAsset", function() {
        var smartAssetGeneratedId;
        var smartAsset;

        return SmartAsset.deployed()
            .then(function(instance) {
                smartAsset = instance;
                return smartAsset.createAsset("BMW X5", "photo_url", "document_url", "car");
            })
            .then(function(result) {
                smartAssetGeneratedId = result.logs[0].args.id.c[0];
                return IotSimulation.deployed();
            })
            .then(function(instance) {
                return instance.generateIotOutput(smartAssetGeneratedId, 0);
            })
            .then(function(result) {
                return smartAsset.getAssetById.call(smartAssetGeneratedId);
            })
            .then(function(returnValue) {
                assert.equal(returnValue[0], smartAssetGeneratedId);
                assert.equal(toAscii(returnValue[1]), "BMW X5");
                assert.equal(toAscii(returnValue[2]), "photo_url");
                assert.equal(toAscii(returnValue[3]), "document_url");
                assert.isAbove(returnValue[4], 0, 'millage should be bigger than 0');
                assert.isAbove(returnValue[5], 0, 'damage should be bigger than 0');
                assert.isAbove(returnValue[6], 0, 'latitude should be bigger than 0');
                assert.isAbove(returnValue[7], 0, 'longitude should be bigger than 0');

                assert.equal(returnValue[9], 1, 'state should be SensorDataAreCollected = position 1 in State enum list');
            });
    });

    it("Should update params of SmartAssetAvailability", function() {
        var smartAssetGeneratedId;
        var smartAsset;
        var simulator;
        var smartAssetAvailability;

        return SmartAsset.deployed()
            .then(function(instance) {
                smartAsset = instance;
                return smartAsset.createAsset("BMW X5", "photo_url", "document_url", "car");
            })
            .then(function(result) {
                smartAssetGeneratedId = result.logs[0].args.id.c[0];
                return IotSimulation.deployed();
            })
            .then(function(instance) {
                return instance.generateIotAvailability(smartAssetGeneratedId, true);
            })
            .then(function(result) {
                return CarAssetLogic.deployed();
            })
            .then(function(instance) {
                return instance.getSmartAssetAvailability.call(smartAssetGeneratedId);
            })
            .then(function(returnValue) {
                assert.equal(returnValue, true);
            });
    });

    it("generateIotOutput have to throw exception if id param is absent", function() {
        return IotSimulation.deployed()
            .then(function(instance) {
                return instance.generateIotOutput(0, 0);
            })
            .then(function(returnValue) {
                assert(false, "Throw was expected but didn't.");
            }).catch(function(error) {
                console.log('Expected error. Got it');
            });
    });

    it("generateIotAvailability have to throw exception if id param is absent", function() {
        return IotSimulation.deployed()
            .then(function(instance) {
                return instance.generateIotAvailability(0, true);
            })
            .then(function(returnValue) {
                assert(false, "Throw was expected but didn't.");
            }).catch(function(error) {
                console.log('Expected error. Got it');
            });
    });

    it("generateIotOutput have to throw exception if asset with such id is absent", function() {
        return IotSimulation.deployed()
            .then(function(instance) {
                maxUint32 = 4294967295;
                return instance.generateIotOutput(maxUint32, 0);
            })
            .then(function(returnValue) {
                assert(false, "Throw was expected but didn't.");
            }).catch(function(error) {
                console.log('Expected error. Got it');
            });
    });

    it("generateIotAvailability have to throw exception if asset with such id is absent", function() {
        return IotSimulation.deployed()
            .then(function(instance) {
                maxUint32 = 4294967295;
                return instance.generateIotAvailability(maxUint32, true);
            })
            .then(function(returnValue) {
                assert(false, "Throw was expected but didn't.");
            }).catch(function(error) {
                console.log('Expected error. Got it');
            });
    });

});
