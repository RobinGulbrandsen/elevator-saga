{   

    init: function(elevators, floors) {

        console.log(floors);

        elevators.forEach(function (elevator) {
            elevator.goingUpIndicator(true);
            elevator.goingDownIndicator(true);

            elevator.on("floor_button_pressed", function(num) {
               elevator.goToFloor(num);
            });

            elevator.on("idle", function() {
                if (elevator.currentFloor() === 0) {
                    //elevator.goingUpIndicator(true);
                    //elevator.goingDownIndicator(true);
                } else {
                    //elevator.goingUpIndicator(true);
                    //elevator.goingDownIndicator(true);
                    elevator.goToFloor(0);
                }    
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                //Passing floor going direction checking if it should stop to let more people in
                if (floors[floorNum].buttonStates !== undefined) {
                    if (direction === 'up' && !!floors[floorNum].buttonStates.up && elevator.loadFactor() < 0.4) {
                        console.log('elevator is going up at floor ', floorNum + ' and there are people there');
                        elevator.destinationQueue = [floorNum];
                        elevator.checkDestinationQueue();
                    }
                    if (direction === 'down' && !!floors[floorNum].buttonStates.down && elevator.loadFactor() < 0.4) {
                        console.log('elevator is going down at floor ', floorNum + ' and there are people there');
                        elevator.destinationQueue = [floorNum];
                        elevator.checkDestinationQueue();
                    }
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                console.log('stoped at ', floorNum);
                //If the indicator is going up and there are people in the elevator
                if (elevator.goingUpIndicator() && elevator.getPressedFloors().length > 0) {
                    for (var i = 0; i < elevator.getPressedFloors().length; i++) {
                        if (elevator.getPressedFloors()[i] > floorNum) {
                            elevator.goToFloor(elevator.getPressedFloors()[i]);
                            return;
                        }
                    }

                    //No more people are going up, go down
                    //elevator.goingUpIndicator(false);
                    //elevator.goingDownIndicator(true);
                    for (var i = elevator.getPressedFloors().length; i > 0; i--) {
                        if (elevator.getPressedFloors()[i] < floorNum) {
                            elevator.goToFloor(elevator.getPressedFloors()[i]);
                            return;
                        }
                    }
                }

                //If the indicator is going down and there are people in the elevator
                if (elevator.goingDownIndicator() && elevator.getPressedFloors().length > 0) {
                    for (var i = elevator.getPressedFloors().length; i > 0; i--) {
                        if (elevator.getPressedFloors()[i] < floorNum) {
                            elevator.goToFloor(elevator.getPressedFloors()[i]);
                            return;
                        }
                    }
                    //Noone in the elevator is going down, going up
                    //elevator.goingUpIndicator(true);
                    //elevator.goingDownIndicator(false);
                    for (var i = 0; i < elevator.getPressedFloors().length; i++) {
                        if (elevator.getPressedFloors()[i] > floorNum) {
                            elevator.goToFloor(elevator.getPressedFloors()[i]);
                            return;
                        }
                    }
                }
            });
        });

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                console.log('there are someone at floor ' + floor.floorNum() + ' going up');
                //floorWithUp.push(floor.floorNum());
            });

            floor.on("down_button_pressed", function() {
                console.log('there are someone at floor ' + floor.floorNum() + ' going down');
                //floorWithDown.push(floor.floorNum());
            });
        });
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}