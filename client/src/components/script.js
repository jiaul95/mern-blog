      // CSV Download Button Click Event

            // Handle "Check All" checkbox
            $(document).on('click', '#checkAllOrder', function() {
                const isChecked = $(this).prop('checked');

                // Update all checkboxes on the current page
                $('.order-checkbox').prop('checked', isChecked);

                // Get all order IDs from the current page
                if (isChecked) {
                    // Add all order IDs from current page to selectedOrderIds if not already included
                    $('.order-checkbox').each(function() {
                        const orderId = $(this).data('id');
                        if (!selectedOrderIds.includes(orderId)) {
                            selectedOrderIds.push(orderId);
                        }
                    });
                } else {
                    // Remove all order IDs from current page from selectedOrderIds
                    $('.order-checkbox').each(function() {
                        const orderId = $(this).data('id');
                        selectedOrderIds = selectedOrderIds.filter(id => id !== orderId);
                    });
                }

                // Debug output
                console.log('Selected orders after "Check All":', selectedOrderIds.length, 'orders');
            });

            // Handle individual order checkboxes
            $(document).on('click', '.order-checkbox', function(e) {
                // Stop event propagation to prevent issues
                e.stopPropagation();

                const orderId = $(this).data('id');
                const isChecked = $(this).prop('checked');

                // Update selectedOrderIds array
                if (isChecked && !selectedOrderIds.includes(orderId)) {
                    selectedOrderIds.push(orderId);
                } else if (!isChecked) {
                    selectedOrderIds = selectedOrderIds.filter(id => id !== orderId);
                }

                // Update the "Check All" checkbox state
                const totalCheckboxes = $('.order-checkbox').length;
                const checkedCheckboxes = $('.order-checkbox:checked').length;

                $('#checkAllOrder').prop('checked', totalCheckboxes > 0 && checkedCheckboxes === totalCheckboxes);

                // Debug output
                console.log('Selected orders:', selectedOrderIds.length, 'orders');
            });


            $(document).on('click', '#assignTripBtn', function() {


                if (!selectedRoutes || selectedRoutes.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Route Not Selected',
                        text: 'Please select at least one route number before assigning a trip.',
                        confirmButtonText: 'OK',
                    });
                    return;
                }

                if (selectedOrderIds.length === 0) {
                    Swal.fire({
                        title: 'No Orders Selected',
                        text: 'Please select at least one order to assign a trip.',
                        icon: 'warning',
                        confirmButtonText: 'OK',
                    });
                    return;
                }

                if (!datatable || datatable.rows().count() === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Orders Available',
                        text: 'There are no orders available to assign a trip.',
                        confirmButtonText: 'OK',
                    });
                    return;
                }



                // Confirmation Dialog
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'You are about to assign a trip.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, proceed!',
                    cancelButtonText: 'No, cancel!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        preassignTrip();
                    } else {
                        $("#assignTripBtn")
                            .prop('disabled', false)
                            .html('<i class="fas fa-truck"></i> Assign Trip');
                    }
                });
            });

            function preassignTrip() {
                // Show loading indicator
                Swal.fire({
                    title: 'Processing...',
                    text: 'Please wait while we fetch order details.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                $.ajax({
                    url: '{{ route('total.order.new') }}',
                    type: 'POST',
                    data: {
                        order_ids: selectedOrderIds,
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(response) {
                        Swal.close(); // Close the loading indicator

                        $("#assignTripBtn").prop('disabled', false).html(
                        '<i class="fas fa-truck"></i> Assign Trip');

                        if (!response.status) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.message || "Failed to retrieve order details.",
                                confirmButtonText: 'OK',
                            });
                            return;
                        }

                        const {
                            total_order,
                            total_demand,
                            vehicles = [],
                            minimum_vehicle_required = 1,
                            minimum_vehicle_required_message = "Minimum vehicle required is 1",
                            today_assigned_vehicle = []
                        } = response;

                        let vehicleOptions = vehicles.map(vehicle => {
                            const isAssignedToday = today_assigned_vehicle.includes(vehicle.vehicle_code);
                            const assignedTodayBadge = isAssignedToday ?
                                `<span class="badge bg-info ms-1">Assigned Today</span>` : '';
                            return `
                    <div class="vehicle-option">
                        <input type="checkbox" class="vehicle-checkbox" value="${vehicle.vehicle_code}" data-load="${vehicle.load_capacity}" id="vehicle_${vehicle.vehicle_code}">
                        <label for="vehicle_${vehicle.vehicle_code}">
                            ${vehicle.vehicle_code} (<strong>${vehicle.load_capacity} Cases</strong>) ${assignedTodayBadge}
                        </label>
                    </div>
                `;
                        }).join('');

                        Swal.fire({
                            title: `Total Orders Count: ${total_order} | Qty(Cases): ${total_demand}`,
                            text: "Choose how you want to assign a vehicle:",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Auto-Assign",
                            cancelButtonText: "Manually Assign",
                            reverseButtons: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                assignTrip(null);
                            } else {
                                Swal.fire({
                                    title: "Vehicles List",
                                    html: `
                            <p>${minimum_vehicle_required_message}</p>
                            <p>Please select vehicles:</p>
                            <div style="text-align: left; max-height: 300px; overflow-y: auto;">
                                ${vehicleOptions}
                            </div>
                        `,
                                    showCancelButton: true,
                                    confirmButtonText: "Assign",
                                    cancelButtonText: "Cancel",
                                    preConfirm: () => {
                                        let selectedVehicles = [];
                                        let totalSelectedLoad = 0;

                                        $(".vehicle-checkbox:checked").each(function() {
                                            selectedVehicles.push($(this).val());
                                            totalSelectedLoad += parseFloat($(this)
                                                .data('load'));
                                        });

                                        if (selectedVehicles.length === 0) {
                                            Swal.showValidationMessage(
                                                "Please select at least one vehicle");
                                            return false;
                                        }

                                        if (totalSelectedLoad < total_demand) {
                                            Swal.showValidationMessage(
                                                `The total load capacity of the selected vehicles (${totalSelectedLoad}) is less than the total order quantity (${total_demand}). Please select more vehicles.`
                                                );
                                            return false;
                                        }

                                        return selectedVehicles;
                                    }
                                }).then((vehicleResult) => {
                                    if (vehicleResult.isConfirmed) {
                                        assignTrip(vehicleResult.value);
                                    }
                                });
                            }
                        });
                    },
                    error: function(xhr) {
                        Swal.close(); // Close the loading indicator
                        $("#assignTripBtn").prop('disabled', false).html(
                        '<i class="fas fa-truck"></i> Assign Trip');
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: xhr.responseJSON?.message || "Failed to fetch order details.",
                            confirmButtonText: 'OK',
                        });
                    }
                });
            }

            function assignTrip(selectedVehicle) {
                // Show loading indicator
                Swal.fire({
                    title: 'Assigning Trip...',
                    text: 'Please wait while we process your request.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                let tripData = {
                    start_date: startDate,
                    end_date: endDate,
                    sm_code: $("#smName").val(),
                    asm_code: $("#asmName").val(),
                    rse_code: $("#rseName").val(),
                    dist_code: $("#distributor").val(),
                    selected_routes: selectedRoutes,
                    order_ids: currentPageOrderIds,
                    selectedVehicle: selectedVehicle,
                    _token: $('meta[name="csrf-token"]').attr('content')
                };

                $("#assignTripBtn").prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Processing...');

                $.ajax({
                    url: '{{ route('trip.auto-assign.new') }}',
                    type: 'POST',
                    data: {
                        order_ids: selectedOrderIds,
                        selectedVehicle: selectedVehicle
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    beforeSend: function() {
                        Swal.fire({
                            title: 'Assigning Trip...',
                            text: 'Please wait while we process your request.',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        $("#assignTripBtn").prop('disabled', true).html(
                            '<i class="fas fa-spinner fa-spin"></i> Assigning...');
                    },
                    success: function(response) {
                        Swal.close(); // Close the loading indicator
                        $("#assignTripBtn").prop('disabled', false).html(
                        '<i class="fas fa-truck"></i> Assign Trip');

                        if (response.status) {
                            const assignedVehicles = response.assigned_vehicles || [];
                            let vehicleListHtml = assignedVehicles.map(vehicle =>
                                `<li>${vehicle.vehicle_id} - ${vehicle.trip_id} (${vehicle.num_stops} stops)</li>`
                            ).join('');

                            let downloadCsvButton = assignedVehicles.length > 0 ? `
                <button type="button" class="btn btn-primary" id="assignvehicalCsvBtn">
                    Download CSV
                </button>
            ` : '';

                            Swal.fire({
                                icon: 'success',
                                title: 'Trip Assigned',
                                html: `
                    <p>Trip assigned successfully!</p>
                    <p><strong>Assigned Vehicles:</strong></p>
                    <ul>${vehicleListHtml}</ul>
                    ${downloadCsvButton}
                `,
                                confirmButtonText: 'OK'
                            }).then(() => {
                                window.location.href = '{{ route('trip.list') }}';
                            });

                            // Handle CSV download
                            $(document).on('click', '#assignvehicalCsvBtn', function() {
                                downloadCsv(assignedVehicles);
                            });

                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.message || "Failed to assign trip.",
                                confirmButtonText: 'OK'
                            });
                        }
                    },
                    error: function(xhr) {
                        Swal.close();
                        $("#assignTripBtn").prop('disabled', false).html(
                        '<i class="fas fa-truck"></i> Assign Trip');

                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: xhr.responseJSON?.message || "Failed to assign trip.",
                            confirmButtonText: 'OK'
                        });
                    }
                });
            }



            $(document).on("click", "#downloadCsvBtn", function(e) {
                e.preventDefault();

                if (!datatable || datatable.rows().count() === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Data Available',
                        text: 'There are no orders available to download.',
                        confirmButtonText: 'OK'
                    });
                    return;
                }

                let startDate = $("#startDate").val();
                let endDate = $("#endDate").val();
                let smCode = $("#smName").val();
                let asmCode = $("#asmName").val();
                let rseCode = $("#rseName").val();
                let distCode = $("#distributor").val();
                let selectedRoutes = $("#routeNo").val();



                if (!startDate && !endDate && !smCode && !asmCode && !rseCode && !distCode && (!selectedRoutes ||
                        selectedRoutes.length === 0)) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Select at Least One Filter',
                        text: 'Please select at least one filter before exporting.',
                        confirmButtonText: 'OK'
                    });
                    return;
                }

                $("#downloadCsvBtn").prop('disabled', true).html(
                    '<i class="fas fa-spinner fa-spin"></i> Downloading...');


                let postData = {
                    start_date: startDate,
                    end_date: endDate,
                    sm_code: smCode,
                    asm_code: asmCode,
                    rse_code: rseCode,
                    dist_code: distCode,
                    selected_routes: selectedRoutes
                };

                $.ajax({
                    url: '{{ route('orders.export.csv') }}',
                    type: 'POST',
                    data: postData,
                    xhrFields: {
                        responseType: 'blob'
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(blob) {

                        let link = document.createElement('a');
                        let url = window.URL.createObjectURL(blob);
                        link.href = url;

                        let today = new Date();
                        let dateStr = today.toISOString().split('T')[0];
                        link.download = 'orders_' + dateStr + '.csv';

                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);

                        $("#downloadCsvBtn").prop('disabled', false).html(
                            '<i class="fas fa-download"></i> Download CSV');
                    },
                    error: function(xhr) {
                        $("#downloadCsvBtn").prop('disabled', false).html(
                            '<i class="fas fa-download"></i> Download CSV');
                        Swal.fire({
                            icon: 'error',
                            title: 'Export Failed',
                            text: 'Failed to export orders as CSV.',
                            confirmButtonText: 'OK'
                        });
                    }
                });
            });
      