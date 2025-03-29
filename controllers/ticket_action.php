<php


public function ticket_action(Request $request)
    {
        $index = $request->all();
        $rules = [];
        if ($index['action'] == 'add') {
            $rules = [
                'ACTIVE_STATUS' => 'required',
                'SUMMARY' => 'required',
                'INCIDENT_TYPE_ID' => 'required',
                'SUB_CATEGORY' => 'required',
                'USER_WORK_GROUP_ID' => 'required',
                'REGION' => 'required',
                'CIRCLE' => 'required',
                'CLUSTER' => 'required',
                'TOWN' => 'required',
                'INCIDENT_DETAILS' => 'required',
                // 'attachment' => 'sometimes|mimes:pdf,doc,docx,xls,xlsx|max:2048',
                'SERVICE_IMPACT' => 'required',
                'TICKET_PRIORITY' => 'required',
                'om_by' => 'required',
                'vendor_id' => 'required',
                'FAULT_INFORMED_TO' => 'required',
                // 'USER_RESOLVER_GROUP_ID' => 'required',
                'USER_RESOLVER_GROUP_ID' => 'required|array',
                'USER_RESOLVER_GROUP_ID.*' => 'required'

            ];
            $messages = [
                'SUMMARY.required' => 'The Summary field is Required.',
                'INCIDENT_TYPE_ID.required' => 'The Category is Required.',
                'SUB_CATEGORY.required' => 'The Sub Category is Required',
                'REGION.required' => 'The Region field is Required.',
                'CIRCLE.required' => 'The Circle field is Required.',
                'CLUSTER.required' => 'The Cluster field is Required.',
                'TOWN.required' => 'The Town field is Required.',
                'USER_WORK_GROUP_ID.required' => 'The Workgroup field is Required.',
                // 'USER_RESOLVER_GROUP_ID.required' => 'Resolver Group is Required.',
                'USER_RESOLVER_GROUP_ID.required' => 'Resolver Group is Required.',
                'USER_RESOLVER_GROUP_ID.*.required' => 'Resolver Group is Required.',
                'INCIDENT_DETAILS.required' => 'Incident Details is Required.',
                // 'attachment.required' => 'PDF,DOC,DOCX,XLS,XLSX Support only',
                'TICKET_PRIORITY.required' => 'Ticket Priority is Required.',
                'SERVICE_IMPACT.required' => 'Service Impact is Required.',
                'om_by.required' => 'O&M is Required',
                'vendor_id.required' => 'Vendor is Required',
                'FAULT_INFORMED_TO.required' => 'Informed To is Required'
            ];
            $category = IncidentTypeMaster::where('PK_INCIDENT_TYPE_ID', $index['INCIDENT_TYPE_ID'])
                ->first(['INCIDENT_TYPE_NAME']);

            $fetchSubCategory = IncidentTypeMaster::where('PK_INCIDENT_TYPE_ID', $index['SUB_CATEGORY'] ?? '')
                ->first(['INCIDENT_TYPE_NAME']);
            $allowedEmptyAlarm =  IncidentTypeMaster::whereIn('INCIDENT_TYPE_NAME', ['OLP', 'IRU-DF', 'MissedAlarm', 'Performance', 'PE', 'DCN'])
                ->select('INCIDENT_TYPE_NAME', 'PK_INCIDENT_TYPE_ID')->get()->pluck('PK_INCIDENT_TYPE_ID')->toArray();
            $categoryName = strtolower($category->INCIDENT_TYPE_NAME ?? '');
            $subCategoryName = strtolower($fetchSubCategory->INCIDENT_TYPE_NAME ?? '');
            if (!empty($category) && !empty($fetchSubCategory) && (($categoryName == 'tx' && $subCategoryName == 'isp') || ($categoryName == 'tx' && $subCategoryName == 'infra') || ($categoryName == 'transmission' && $subCategoryName == 'infra-utility') || ($categoryName == 'transmission' && $subCategoryName == 'isp-transmission faults'))) {
                $rules['NE_AFFECTED2.*'] = 'required';
                $messages['NE_AFFECTED2.*.required'] = 'NE Affected is Required';
            }

            if ($allowedEmptyAlarm && !in_array($request->SUB_CATEGORY,  $allowedEmptyAlarm)) {
                $rules['ALARM_ID'] = 'required';
                $messages['ALARM_ID.required'] = 'Alarm ID is Required';
            }
        } else {
            $fetchSubCategory = IncidentTypeMaster::where('PK_INCIDENT_TYPE_ID', $index['SUB_CATEGORY'] ?? '')
                ->first(['INCIDENT_TYPE_NAME']);
            $allowedEmptyAlarm =  IncidentTypeMaster::whereIn('INCIDENT_TYPE_NAME', ['OLP', 'IRU-DF', 'MissedAlarm', 'Performance', 'PE', 'DCN'])
                ->select('INCIDENT_TYPE_NAME', 'PK_INCIDENT_TYPE_ID')->get()->pluck('PK_INCIDENT_TYPE_ID')->toArray();
            $rules = [
                'SUMMARY' => 'required',
                'INCIDENT_TYPE_ID' => 'required',
                'SUB_CATEGORY' => 'required',
                'INCIDENT_DETAILS' => 'required',
                'REGION' => 'required',
                'CIRCLE' => 'required',
                'CLUSTER' => 'required',
                'TOWN' => 'required',
                'SERVICE_IMPACT' => 'required',
                'TICKET_PRIORITY' => 'required',
                'om_by' => 'required',
                'vendor_id' => 'required',
                'FAULT_INFORMED_TO' => 'required',
                'USER_RESOLVER_GROUP_ID' => 'required|array',
                'USER_RESOLVER_GROUP_ID.*' => 'required',
            ];

            // if ($index['ACTIVE_STATUS'] == 2 && empty($index['EVENT_ENT_DATE'])) {
            //     $rules['EVENT_ENT_DATE'] = 'required';
            // }
            if ($allowedEmptyAlarm && !in_array($request->SUB_CATEGORY,  $allowedEmptyAlarm)) {
                $rules['ALARM_ID'] = 'required';
                $messages['ALARM_ID.required'] = 'Alarm ID is Required';
            }
            if (in_array($index['ACTIVE_STATUS'], [2, 3]) && empty($index['EVENT_ENT_DATE'])) {
                $rules['EVENT_ENT_DATE'] = 'required';
            }

            // Incident Resolution Details:
            // if (($index['ACTIVE_STATUS'] == 2) && empty($index['platform'])) {
            if (
                in_array($index['ACTIVE_STATUS'], [2, 3])
                && empty($index['platform'])
            ) {
                $rules['PLATFORM'] = 'required';
            }

            if (($index['ACTIVE_STATUS'] == 3) && empty($index['sub_platform_id'])) {
                $rules['FK_SUB_PLATEFORM_ID'] = 'required';
            }

            if (($index['ACTIVE_STATUS'] == 3) && empty($index['RFO'])) {
                $rules['FK_RFO'] = 'required';
            }

            if (($index['ACTIVE_STATUS'] == 3) && empty($index['FK_RCA_ID'])) {
                $rules['FK_RCA_ID'] = 'required';
            }

            if (($index['ACTIVE_STATUS'] == 3) && empty($index['remedy_id'])) {
                $rules['FK_REMEDY_ID'] = 'required';
            }

            if (($index['ACTIVE_STATUS'] == 3) && empty($index['resolution'])) {
                $rules['resolution'] = 'required';
            }

            if (in_array($index['ACTIVE_STATUS'], [2, 3])) {
                $rules['LOCATION_ID_SMP'] = 'required';
            }

            $messages = [
                'EVENT_ENT_DATE.required' => 'Event End Date is Required.',
                'SUMMARY.required' => 'The Summary field is Required.',
                'INCIDENT_TYPE_ID.required' => 'The Category is Required.',
                'SUB_CATEGORY.required' => 'The Sub Category is Required',
                'REGION.required' => 'The Region field is Required.',
                'CIRCLE.required' => 'The Circle field is Required.',
                'CLUSTER.required' => 'The Cluster field is Required.',
                'TOWN.required' => 'The Town field is Required.',
                'INCIDENT_DETAILS.required' => 'Incident Details is Required.',
                'TICKET_PRIORITY.required' => 'Ticket Priority is Required.',
                'SERVICE_IMPACT.required' => 'Service Impact is Required.',
                'vendor_id.required' => 'Vendor is Required',
                'om_by.required' => 'O&M is Required',
                'FAULT_INFORMED_TO.required' => 'Informed To is Required',
                'FK_SUB_PLATEFORM_ID.required' => 'Fault Type is Required.',
                'FK_RFO.required' => 'RFO is Required.',
                'FK_RCA_ID.required' => 'RCA is Required.',
                'FK_REMEDY_ID.required' => 'Remedy is Required.',
                'USER_RESOLVER_GROUP_ID.required' => 'Resolver Group is Required.',
                'USER_RESOLVER_GROUP_ID.*.required' => 'Resolver Group is Required.',
                'PLATFORM.required' => 'Platform is required.',
                'resolution.required' => 'Resolution is Required.',
                'LOCATION_ID_SMP.required' => 'Location ID (SMP ID) is Required.'
            ];

            if (!empty($fetchSubCategory) && $fetchSubCategory->INCIDENT_TYPE_NAME == 'OSP' && ($index['ACTIVE_STATUS'] == 3)) {

                $additionalFieldRules = [
                    'route_id.*' => 'required',
                    'route_name2.*' => 'required',
                    'route_details.*' => 'required',
                    'span_name.*' => 'required',
                    'route_type.*' => 'required',
                    'route_operator.*' => 'required',
                    'route_owner.*' => 'required',
                ];
                $rules += $additionalFieldRules;
                $messages['route_id.*.required'] = 'Route ID is Required for OSP';
                $messages['route_name2.*.required'] = 'Route Name is Required for OSP';
                $messages['span_name.*.required'] = 'Span Name is Required for OSP';
                $messages['route_details.*.required'] = 'Route Details is Required for OSP';
                $messages['route_type.*.required'] = 'Route Type is Required for OSP';
                $messages['route_operator.*.required'] = 'Route Operator is Required for OSP';
                $messages['route_owner.*.required'] = 'Route Owner is Required for OSP';
            }

            $category = IncidentTypeMaster::where('PK_INCIDENT_TYPE_ID', $index['INCIDENT_TYPE_ID'])
                ->first(['INCIDENT_TYPE_NAME']);
            $categoryName = strtolower($category->INCIDENT_TYPE_NAME ?? '');
            $subCategoryName = strtolower($fetchSubCategory->INCIDENT_TYPE_NAME ?? '');
            if (!empty($category) && !empty($fetchSubCategory) && (($categoryName == 'tx' && $subCategoryName == 'isp') || ($categoryName == 'tx' && $subCategoryName == 'infra') || ($categoryName == 'transmission' && $subCategoryName == 'infra-utility') || ($categoryName == 'transmission' && $subCategoryName == 'isp-transmission faults'))) {
                $rules['NE_AFFECTED2.*'] = 'required';
                $messages['NE_AFFECTED2.*.required'] = 'NE Affected is Required';
            }

            if (!empty($index['TTR']) && $index['ACTIVE_STATUS'] == 3) {
                $ttrTime = explode(':', $index['TTR']);
                $hours = (int)$ttrTime[0];
                $minutes = (int)$ttrTime[1];
                $seconds = (int)$ttrTime[2];
                $totalSeconds = $hours * 3600 + $minutes * 60 + $seconds;
                if ($totalSeconds >= 4 * 3600) {
                    $delayReasonRequiredField = [
                        'delay_reason' => 'required',
                    ];
                    $rules += $delayReasonRequiredField;
                    $messages['delay_reason.required'] = 'Delay Reason is Required';
                }
            }
        }

        $validator = Validator::make($index, $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        // if (isset($index['EVENT_START_DATE'])) {
        //     $eventStartTime = strtotime($index['EVENT_START_DATE']);
        //     $event_start_date = date('Y-m-d H:i:s', $eventStartTime);
        //     if ($eventStartTime > time()) {
        //         return response()->json(['error' => 'You cannot select a future date, for event start time.']);
        //     }
        // }

        if (isset($index['EVENT_START_DATE'])) {
            // Format the input date first
            $event_start_date = date('Y-m-d H:i:s', strtotime($index['EVENT_START_DATE']));
            $eventStartTime = strtotime($event_start_date);
            if ($eventStartTime > time()) {
                return response()->json(['error' => 'You cannot select a future date for the event start time.']);
            }
        }


        if (isset($index['fault_esc_time'])) {
            $fault_esc_datetime = Carbon::parse($index['fault_esc_time']);
            $fault_esc_time = $fault_esc_datetime->format('Y-m-d H:i:s');
        }
        if (isset($index['fault_revert_time'])) {
            $fault_revert_datetime = Carbon::parse($index['fault_revert_time']);
            $fault_revert_time = $fault_revert_datetime->format('Y-m-d H:i:s');
        }
        if (isset($index['last_action'])) {
            $last_action_datetime = Carbon::parse($index['last_action']);
            $last_action = $last_action_datetime->format('Y-m-d H:i:s');
        }
        if (isset($index['next_action'])) {
            $next_action_datetime = Carbon::parse($index['next_action']);
            $next_action = $next_action_datetime->format('Y-m-d H:i:s');
        }

            
            try {
                /**
                 * @var TicketMaster $ticketData
                 */
                $ticketData = TicketMaster::where('PK_INCIDENT_ID', $index['ticket_id'])
                    ->first();
                $prevTicketData = json_decode(json_encode($ticketData));
                $checkResolvedTime = clone $prevTicketData;


                $serviceImpact = Service_impact::where('PK_SERVICE_IMPACT_ID', $ticketData->SERVICE_IMPACT)->first();
                if (isset($index['EVENT_ENT_DATE'])) {
                    $eventend = $index['EVENT_ENT_DATE'];
                    $eventEndTime = strtotime($eventend);
                    $event_end_date = date('Y-m-d H:i:s', $eventEndTime);
                    if ($eventEndTime > time()) {
                        return response()->json(['error' => 'Event End date time must not be greater than current time (' . date('d/m/Y h:i:s a') . ').']);
                    }
                    if (($eventStartTime ?? null) && $eventEndTime <= $eventStartTime) {
                        return response()->json(['error' => 'Event End date and time must be greater than start date and time.']);
                    }
                }
                // dd("dasd");
                // if (!empty($checkResolvedTime->TKT_RESOLVED_TIME) && isset($index['EVENT_ENT_DATE']) && $index['ACTIVE_STATUS'] == 3) {
                if (!empty($checkResolvedTime->TKT_RESOLVED_TIME) && isset($index['EVENT_ENT_DATE']) && in_array($index['ACTIVE_STATUS'], [2, 3])) {
                    $eventEndTime = strtotime($index['EVENT_ENT_DATE']);
                    $tktResolvedTime = strtotime($checkResolvedTime->TKT_RESOLVED_TIME);
                    if ($tktResolvedTime !== false && $eventEndTime > $tktResolvedTime) {
                        return response()->json(['error' => 'Event End time cannot be greater than TT resolved time.']);
                    }
                }

                if (!empty($checkResolvedTime->TKT_CLOSED_TIME) && isset($index['EVENT_ENT_DATE'])) {
                    $eventEndTime = strtotime($index['EVENT_ENT_DATE']);
                    $tktClosedTime = strtotime($checkResolvedTime->TKT_CLOSED_TIME);
                    if ($tktClosedTime !== false && $eventEndTime > $tktClosedTime) {
                        return response()->json(['error' => 'Event End time cannot be greater than TT closed time.']);
                    }
                }


                // Check if Event start time is greater than TT Creation time                
                // if (!empty($ticketData->CREATED_AT) && isset($index['EVENT_START_DATE'])) {
                //     $eventStartTime = strtotime($index['EVENT_START_DATE']);
                //     $tktCreationTime = strtotime($ticketData->CREATED_AT);
                //     if ($tktCreationTime !== false && $eventStartTime > $tktCreationTime) {
                //         return response()->json(['error' => 'Event Start time cannot be greater than TT Creation time.']);
                //     }
                // }

                if (!empty($ticketData->CREATED_AT) && isset($index['EVENT_START_DATE'])) {
                    // Format the dates first
                    $formattedEventStartDate = date('Y-m-d H:i:s', strtotime($index['EVENT_START_DATE']));
                    $formattedTktCreationDate = date('Y-m-d H:i:s', strtotime($ticketData->CREATED_AT));

                    // Convert the formatted dates to timestamps
                    $eventStartTime = strtotime($formattedEventStartDate);
                    $tktCreationTime = strtotime($formattedTktCreationDate);

                    if ($tktCreationTime !== false && $eventStartTime > $tktCreationTime) {
                        return response()->json(['error' => 'Event Start time cannot be greater than TT Creation time.']);
                    }
                }

                $workGroupName = isset($index['USER_WORK_GROUP_ID']) ? $index['USER_WORK_GROUP_ID'] : null;
                $workGroup = WorkgroupMaster::where('GROUP_NAME', $workGroupName)->first();
                // if (!empty($index['REPORTED_BY_UA_USER'])) {
                //     $UA_REPORTED_BY = $index['REPORTED_BY_UA_USER'];
                // }

                //Espected Resolution Date(Edit)
                $espectedDatetime = null;

                if (!empty($index['expected_resolution'])) {
                    $currentDatetime = Carbon::now();
                    if ($index['expected_resolution'] == 'SA- 4hrs') {
                        // Add 4 hours
                        $espectedDatetime = Carbon::parse($currentDatetime->addHours(4))->format('Y-m-d h:i:s');
                    } elseif ($index['expected_resolution'] == 'SD-6hrs') {
                        // Add 6 hours
                        $espectedDatetime = Carbon::parse($currentDatetime->addHours(6))->format('Y-m-d h:i:s');
                    } elseif ($index['expected_resolution'] == 'NSA & ST-8hrs') {
                        // Add 8 hours
                        $espectedDatetime = Carbon::parse($currentDatetime->addHours(8))->format('Y-m-d h:i:s');
                    }
                }


                if ($request->hasFile('attachment')) {

                    $fileValidation = [
                        'attachment' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,xls,xlsx|max:2048',
                    ];
                    $rules += $fileValidation;
                    $messages['attachment.file'] = 'The Uploaded file is invalid';
                    $messages['mimes.mimes'] = 'Only JPEG, PNG, JPG, GIF, PDF, DOC, DOCX, XLS, XLSX files are allowed.';
                    $messages['mimes.max'] = 'The file size must be less than 2 MB.';

                    $image = $request->file('attachment');

                    if ($image->isValid()) {
                        $originalFileName = $image->getClientOriginalName();
                        $fileNameWithoutSpaces = Str::slug(pathinfo($originalFileName, PATHINFO_FILENAME));
                        $fileExtension = $image->getClientOriginalExtension();
                        $fileName = substr(time(), 0, 10) . '_' . $index["ticket_number"] . '_' . $fileNameWithoutSpaces . '.' . $fileExtension;
                        $image->move(public_path('ticket_attachments'), $fileName);
                        $filePath = url('/') . '/public/ticket_attachments/' . $fileName;

                        $ticketData->ATTACHMENT_NAME = isset($fileName) ? $fileName : null;
                        $ticketData->ATTACHMENT_PATH = isset($filePath) ? $filePath : null;
                    }
                }

                // check if the status is reopen
                if ($index['ACTIVE_STATUS'] == 4 && !empty($ticketData->TKT_RESOLVED_TIME)) {

                    $allowedTimeLimit = 6;
                    if ($subCategoryName == 'isp') {
                        $allowedTimeLimit = 12;
                    }
                    $tktResolvedTime = Carbon::parse($ticketData->TKT_RESOLVED_TIME);
                    $tktResolvedTimeLimit =  $tktResolvedTime->addHours($allowedTimeLimit);
                    // strtotime($ticketData->TKT_RESOLVED_TIME, '+' . $allowedTimeLimit . ' hours');
                    if ($tktResolvedTimeLimit !== false && $tktResolvedTimeLimit->getTimestamp() < time()) {
                        return response()->json(['error' => 'Can\'t reopen this ticket, ' . $allowedTimeLimit . ' hours time limit has been exceeded.']);
                    }

                    $ticketData->TKT_RESOLVED_TIME = null;
                    $ticketData->TKT_CLOSED_TIME = null;
                    $ticketData->FK_RESOLVED_BY = null;
                    $ticketData->TKT_REOPEN_TIME = now();
                }


                $ticketData->STATUS_ID = isset($index['ACTIVE_STATUS']) ? $index['ACTIVE_STATUS'] : null;
                $ticketData->SUMMARY = isset($index['SUMMARY']) ? $index['SUMMARY'] : null;
                $ticketData->FK_ISSUE_TYPE = isset($index['INCIDENT_TYPE_ID']) ? $index['INCIDENT_TYPE_ID'] : null;
                $ticketData->FK_CREATED_BY = Auth::user()->UserID;
                $ticketData->NOC_SITE = isset($index['NOC_SITE']) ? $index['NOC_SITE'] : null;
                $ticketData->USER_FORWARDED_WORK_GROUP_ID = $index['USER_FORWARDED_WORK_GROUP_ID'] ?? null;
                $ticketData->FK_RESOLVER_GROUP_ID = isset($index['USER_RESOLVER_GROUP_ID']) ? implode(",", $index['USER_RESOLVER_GROUP_ID']) : null;
                $ticketData->ALARM_ID = isset($index['ALARM_ID']) ? $index['ALARM_ID'] : null;
                $ticketData->SUB_CATEGORY = isset($index['SUB_CATEGORY']) ? $index['SUB_CATEGORY'] ?? '' : null;
                $ticketData->TTL_TCTS = isset($index['TTL_TCTS']) ? $index['TTL_TCTS'] : null;
                $ticketData->ALARAM_NAME = isset($index['ALARAM_NAME']) ? $index['ALARAM_NAME'] : null;
                $ticketData->INCIDENT_DETAILS = isset($index['INCIDENT_DETAILS']) ? $index['INCIDENT_DETAILS'] : null;
                $ticketData->SMS_NOTIFIED = isset($index['SMS_NOTIFIED']) ? $index['SMS_NOTIFIED'] : null;
                $ticketData->UPDATED_AT = NOW();
                //Circuit Id Details                   
                $ticketData->NO_NE = isset($index['NO_NE']) ? $index['NO_NE'] : null;
                $ticketData->IMPACT = isset($index['IMPACT']) ? $index['IMPACT'] : null;
                $ticketData->TTM_NO = isset($index['TTM_NO']) ? $index['TTM_NO'] : null;
                $ticketData->SERVICE_IMPACT_UA = isset($index['SERVICE_IMPACT_UA']) ? $index['SERVICE_IMPACT_UA'] : null;
                $ticketData->SERVICE_IMPACT = isset($index['SERVICE_IMPACT']) ? $index['SERVICE_IMPACT'] : null;
                $ticketData->NO_OF_CUSTOMER_IMPACTED = isset($index['NO_OF_CUSTOMER_IMPACTED']) ? $index['NO_OF_CUSTOMER_IMPACTED'] : null;
                $ticketData->TICKET_PRIORITY = isset($index['TICKET_PRIORITY']) ? $index['TICKET_PRIORITY'] : null;
                $ticketData->NO_OF_TOPOLOGY = isset($index['NO_OF_TOPOLOGY']) ? $index['NO_OF_TOPOLOGY'] : null;
                //Reso
                $ticketData->EXPECTED_RESOLUTION_TIME = $espectedDatetime ?? null;
                $ticketData->NUMBER_CIRCUIT_AFFECTED = isset($index['NUMBER_CIRCUIT_AFFECTED']) ? $index['NUMBER_CIRCUIT_AFFECTED'] : null;
                // new location ids // 
                $ticketData->LOCATION_ID_SMP = isset($index['LOCATION_ID_SMP']) ? $index['LOCATION_ID_SMP'] : null;
                $ticketData->SUB_LOCATION_ID = isset($index['SUB_LOCATION_ID']) ? $index['SUB_LOCATION_ID'] : null;
                $ticketData->FK_LOCATION_ID = isset($index['LOCATION_ID']) ? $index['LOCATION_ID'] : null;
                // new location ids // 
                $ticketData->WGtech = isset($index['WGtech']) ? $index['WGtech'] : null;
                $ticketData->UA_USER_ID = $index['REPORTED_BY_UA_USER'] ?? null;
                // circle ,region,cluster,town,city
                $ticketData->FK_REGION = isset($index['REGION']) ? $index['REGION'] : null;
                $ticketData->FK_CIRCLE = isset($index['CIRCLE']) ? $index['CIRCLE'] : null;
                $ticketData->FK_CLUSTER_ID = isset($index['CLUSTER']) ? $index['CLUSTER'] : null;
                $ticketData->FK_CITY_ID = isset($index['TOWN']) ? $index['TOWN'] : null;
                $ticketData->FAULT_INFORMED_TO = $index['FAULT_INFORMED_TO'] ?? null;
                $ticketData->RESOLUTION = isset($index['resolution']) ? $index['resolution'] : null;
                $ticketData->FAULT_RESTORATION_TYPE = isset($index['FAULT_RESTORATION_TYPE']) ? $index['FAULT_RESTORATION_TYPE'] : null;
                $ticketData->OM_BY = isset($index['om_by']) ? $index['om_by'] : null;
                $ticketData->FK_VENDOR_ID = isset($index['vendor_id']) ? $index['vendor_id'] : null;
                $ticketData->PLATFORM = isset($index['platform']) ? $index['platform'] : null;
                $ticketData->FK_SUB_PLATEFORM_ID = isset($index['sub_platform_id']) ? $index['sub_platform_id'] : null; //error
                $ticketData->FK_REMEDY_ID = isset($index['remedy_id']) ? $index['remedy_id'] : null;
                $ticketData->FK_RFO = isset($index['RFO']) ? $index['RFO'] : null;  //error
                $ticketData->FK_RCA_ID = isset($index['FK_RCA_ID']) ? $index['FK_RCA_ID'] : null;
                // incident remark
                $ticketData->INCIDENT_REMARK = isset($index['INCIDENT_REMARK']) ? $index['INCIDENT_REMARK'] : null;
                $ticketData->FIBER_CUT_TYPE = isset($index['fiber_cut_type']) ? $index['fiber_cut_type'] : null;
                $ticketData->FRT_LOCATION = isset($index['osp_frt_location']) ? $index['osp_frt_location'] : null;
                $ticketData->ROUTE_STATE = isset($index['route_state']) ? $index['route_state'] : null;
                $ticketData->ORGINATING_NO = isset($index['originating_no']) ? $index['originating_no'] : null;
                $ticketData->TERMINATING_SECTIONB = isset($index['terminating_sectionb']) ? $index['terminating_sectionb'] : null;
                $ticketData->FK_DELAY_REASON = isset($index['delay_reason']) ? $index['delay_reason'] : null;
                $ticketData->SERVICE_REQUEST = isset($index['service_request']) ? $index['service_request'] : null;

                if ($index['ACTIVE_STATUS'] == 2 || $index['ACTIVE_STATUS'] == 3) {
                    $ticketData->EVENT_ENT_DATE = $event_end_date ?? null;
                }

                $ticketData->save();

                if (!empty($index['NE_AFFECTED2']) && isset($index['NE_AFFECTED2'])) {
                    foreach ((array)$index['NE_AFFECTED2'] as $key => $value) {

                        if (isset($value) && !empty($value)) {
                            // check neAffected from neAffected master table
                            // May need uncomment later
                            // if (!NeAffectedMaster::where('NE_AFFECTED_NAME', trim($index['NE_AFFECTED2'][$key]))
                            //     ->where('STATUS', 1)
                            //     ->exists()) {
                            //     NeAffectedMaster::create([
                            //         'NE_AFFECTED_NAME' => $index['NE_AFFECTED2'][$key] ?? null,
                            //         'SMP_ID' => $index['SMP_ID'][$key] ?? null,
                            //         'STATUS' => 1
                            //     ]);
                            // }

                            $smpId = null;
                            if ($index['SMP_ID'][$key] ?? null) {
                                $smpId = TKTSMP::where('SMP_ID',  $index['SMP_ID'][$key])->first()->PK_SMP_ID ?? null;
                                if (empty($smpId)) {
                                    $smp = TKTSMP::create([
                                        'SMP_ID' =>  $index['SMP_ID'][$key],
                                        'STATUS' => 1,
                                    ]);
                                    $smpId = $smp->PK_SMP_ID;
                                }
                            }

                            if (isset($index['SR_NO2'][$key]) && !empty($index['SR_NO2'][$key])) {
                                $check_ne_records = Ne_affected::where('PK_AFFECTED_ID', $index['SR_NO2'][$key])
                                    ->where('FK_TICKET_ID', $index['ticket_id'])->first();

                                if (!empty($check_ne_records)) {
                                    Ne_affected::where('PK_AFFECTED_ID', $index['SR_NO2'][$key])
                                        ->update(
                                            [
                                                'NE_AFFECTED' => $index['NE_AFFECTED2'][$key] ?? null,
                                                'FK_REGION' => $index['REGION2'][$key] ?? null,
                                                'FK_CIRCLE' => $index['CIRCLE2'][$key] ?? null,
                                                'FK_STATE_ID' => $index['state_id2'][$key] ?? null,
                                                'FK_DISTRICT_ID' => $index['district_id2'][$key] ?? null,
                                                'FK_CLUSTER' => $index['cluster2'][$key] ?? null,
                                                'FK_TOWN' => $index['town2'][$key] ?? null,
                                                'SMP_ID' => $index['SMP_ID'][$key] ?? null,
                                                'SUB_LOCATION_ID' =>  $index['SMP_ID'][$key] ?? null,
                                                'FK_SMP_ID' => $smpId,
                                                'FK_LOCATION_ID' => $index['NELOCATION_ID'][$key] ?? null,
                                                'FK_AREA' => $index['AREA'][$key] ?? null,
                                                'FK_NE_TYPE' => $index['NE_TYPE'][$key] ?? null,
                                                'ACTIVE_STATUS' => 1,
                                                'created_at' => NOW()
                                            ]
                                        );
                                } else {
                                    Ne_affected::create([
                                        'FK_TICKET_ID' => $index['ticket_id'],
                                        'NE_AFFECTED' => $index['NE_AFFECTED2'][$key] ?? null,
                                        'FK_REGION' => $index['REGION2'][$key] ?? null,
                                        'FK_CIRCLE' => $index['CIRCLE2'][$key] ?? null,

                                        'FK_STATE_ID' => $index['state_id2'][$key] ?? null,
                                        'FK_DISTRICT_ID' => $index['district_id2'][$key] ?? null,
                                        'FK_CLUSTER' => $index['cluster2'][$key] ?? null,
                                        'FK_TOWN' => $index['town2'][$key] ?? null,
                                        'SMP_ID' => $index['SMP_ID'][$key] ?? null,
                                        'SUB_LOCATION_ID' =>  $index['SMP_ID'][$key] ?? null,
                                        'FK_SMP_ID' => $smpId,
                                        'FK_LOCATION_ID' => $index['NELOCATION_ID'][$key] ?? null,
                                        'FK_AREA' => $index['AREA'][$key] ?? null,
                                        'FK_NE_TYPE' => $index['NE_TYPE'][$key] ?? null,
                                        'ACTIVE_STATUS' => 1,
                                        'created_at' => NOW()
                                    ]);
                                }
                            } else {
                                Ne_affected::create([
                                    'FK_TICKET_ID' => $index['ticket_id'],
                                    'NE_AFFECTED' => $index['NE_AFFECTED2'][$key] ?? null,
                                    'FK_REGION' => $index['REGION2'][$key] ?? null,
                                    'FK_CIRCLE' => $index['CIRCLE2'][$key] ?? null,

                                    'FK_STATE_ID' => $index['state_id2'][$key] ?? null,
                                    'FK_DISTRICT_ID' => $index['district_id2'][$key] ?? null,
                                    'FK_CLUSTER' => $index['cluster2'][$key] ?? null,
                                    'FK_TOWN' => $index['town2'][$key] ?? null,
                                    'SMP_ID' => $index['SMP_ID'][$key] ?? null,
                                    'SUB_LOCATION_ID' =>  $index['SMP_ID'][$key] ?? null,
                                    'FK_SMP_ID' => $smpId,
                                    'FK_LOCATION_ID' => $index['NELOCATION_ID'][$key] ?? null,
                                    'FK_AREA' => $index['AREA'][$key] ?? null,
                                    'FK_NE_TYPE' => $index['NE_TYPE'][$key] ?? null,
                                    'ACTIVE_STATUS' => 1,
                                    'created_at' => NOW()
                                ]);
                            }
                            // }
                            // }
                        }
                    }
                }

                //Route Details
                if ((!empty($index['route_id']) && isset($index['route_id'])) || (!empty($index['route_name2']) && isset($index['route_name2']))) {

                    foreach ((array)$index['route_name2'] as $key => $value) {
                        if (isset($value) && !empty($value)) {


                            if (isset($index['PK_ROUTE_ID'][$key]) && !empty($index['PK_ROUTE_ID'][$key])) {

                                $check_route_details = Route_details::where('PK_ROUTE_ID', $index['PK_ROUTE_ID'][$key])
                                    ->where('FK_TICKET_ID', $index['ticket_id'])->first();

                                if (!empty($check_route_details)) {
                                    Route_details::where('PK_ROUTE_ID', $index['PK_ROUTE_ID'][$key])
                                        ->update(
                                            [
                                                'FK_TICKET_ID' => $index['ticket_id'],
                                                'ROUTE_ID' => $index['route_id'][$key] ?? null,
                                                'ROUTE_NAME' => $index['route_name2'][$key] ?? null,
                                                'SECTION_A' => $index['section_a'][$key] ?? null,
                                                'SECTION_B' => $index['section_b'][$key] ?? null,
                                                'ROUTE_DETAILS' => $index['route_details'][$key] ?? null,
                                                'ROUTE_TYPE' => $index['route_type'][$key] ?? null,
                                                'SPAN_NAME' => $index['span_name'][$key] ?? null,
                                                'ROUTE_OPERATOR' => $index['route_operator'][$key] ?? null,
                                                'ROUTE_OWNER' => $index['route_owner'][$key] ?? null,
                                                'SPAN_LENGTH' => $index['span_length'][$key] ?? null,
                                                'NO_OF_PAIRS' => $index['no_of_pairs'][$key] ?? null,
                                                'PAIRS_USED_BY_TTL' => $index['pairs_used_by_ttl'][$key] ?? null,
                                                'FRT_LOCATION' => $index['frt_location'][$key] ?? null,
                                                'ACTIVE_STATUS' => 1,
                                                'created_at' => NOW()
                                            ]
                                        );
                                } else {
                                    Route_details::create([
                                        'FK_TICKET_ID' => $index['ticket_id'],
                                        'ROUTE_ID' => $index['route_id'][$key] ?? null,
                                        'ROUTE_NAME' => $index['route_name2'][$key] ?? null,
                                        'SECTION_A' => $index['section_a'][$key] ?? null,
                                        'SECTION_B' => $index['section_b'][$key] ?? null,
                                        'ROUTE_DETAILS' => $index['route_details'][$key] ?? null,
                                        'ROUTE_TYPE' => $index['route_type'][$key] ?? null,
                                        'SPAN_NAME' => $index['span_name'][$key] ?? null,
                                        'ROUTE_OPERATOR' => $index['route_operator'][$key] ?? null,
                                        'ROUTE_OWNER' => $index['route_owner'][$key] ?? null,
                                        'SPAN_LENGTH' => $index['span_length'][$key] ?? null,
                                        'NO_OF_PAIRS' => $index['no_of_pairs'][$key] ?? null,
                                        'PAIRS_USED_BY_TTL' => $index['pairs_used_by_ttl'][$key] ?? null,
                                        'FRT_LOCATION' => $index['frt_location'][$key] ?? null,
                                        'ACTIVE_STATUS' => 1,
                                        'created_at' => NOW()
                                    ]);
                                }
                            } else {
                                Route_details::create([
                                    'FK_TICKET_ID' => $index['ticket_id'],
                                    'ROUTE_ID' => $index['route_id'][$key] ?? null,
                                    'ROUTE_NAME' => $index['route_name2'][$key] ?? null,
                                    'SECTION_A' => $index['section_a'][$key] ?? null,
                                    'SECTION_B' => $index['section_b'][$key] ?? null,
                                    'ROUTE_DETAILS' => $index['route_details'][$key] ?? null,
                                    'ROUTE_TYPE' => $index['route_type'][$key] ?? null,
                                    'SPAN_NAME' => $index['span_name'][$key] ?? null,
                                    'ROUTE_OPERATOR' => $index['route_operator'][$key] ?? null,
                                    'ROUTE_OWNER' => $index['route_owner'][$key] ?? null,
                                    'SPAN_LENGTH' => $index['span_length'][$key] ?? null,
                                    'NO_OF_PAIRS' => $index['no_of_pairs'][$key] ?? null,
                                    'PAIRS_USED_BY_TTL' => $index['pairs_used_by_ttl'][$key] ?? null,
                                    'FRT_LOCATION' => $index['frt_location'][$key] ?? null,
                                    'ACTIVE_STATUS' => 1,
                                    'created_at' => NOW()
                                ]);
                            }
                        }
                    }
                }

                $circuitDetails = [];

                if (!empty($index['CIRCUIT_ID']) && isset($index['CIRCUIT_ID'])) {
                    foreach ((array)$index['CIRCUIT_ID'] as $key => $value) {
                        // Check if $value is not empty and all required indexes are set
                        // if (!empty($value) && isset($index['CIRCUIT_TYPE'][$key]) && isset($index['CUSTOMER_IMPACTED'][$key]) && isset($index['BANDWIDTH'][$key])) {
                        if (!empty($value)) {

                            $RequestObject = [
                                'circuitId' => $value ?? null,
                                'circuitType' => $index['CIRCUIT_TYPE'][$key] ?? null,
                                'customerName' => $index['CUSTOMER_IMPACTED'][$key] ?? null,
                                'bandwidth' => $index['BANDWIDTH'][$key] ?? null,
                            ];

                            // Determine if PK_CIRCUIT_ID exists and is valid
                            $pk_circuit_id = isset($index['PK_CIRCUIT_ID'][$key]) ? $index['PK_CIRCUIT_ID'][$key] : null;

                            // Find existing CircuitDetails record by PK_CIRCUIT_ID and FK_TICKET_ID
                            $check_circuit_details = CircuitDetails::where('PK_CIRCUIT_ID', $pk_circuit_id)
                                ->first();

                            if (!empty($check_circuit_details)) {


                                if ($value == $check_circuit_details->CIRCUIT_ID) {
                                    $DBActivity = [
                                        // 'ActivityStatus' => 'FULL UPDATE', Removed full update as suggested by CRM team
                                        'ActivityStatus' => 'PARTIAL UPDATE',
                                        'EventType' => 'UPDATE',
                                        'DBObject' => $check_circuit_details->toArray()
                                    ];
                                    $RequestActivity = [
                                        // 'ActivityStatus' => 'FULL UPDATE', Removed full update as suggested by CRM team
                                        'ActivityStatus' => 'PARTIAL UPDATE',
                                        'EventType' => 'UPDATE',
                                        'RequestObject' => $RequestObject
                                    ];
                                    $circuitDetails[] = [
                                        'transactionId' =>  $check_circuit_details->PK_CIRCUIT_ID,
                                        'ticketId' => $ticketData->INCIDENT_NUMBER,
                                        'ticketStatus' => $ticketData->STATUS_ID,
                                        'startTime' => $ticketData->EVENT_START_DATE,
                                        'endTime' => $ticketData->EVENT_ENT_DATE,
                                        'incidentDetails' => $ticketData->INCIDENT_DETAILS ?? null,
                                        'serviceImpact' => $serviceImpact->SERVICE_IMPACT_NAME ?? null,
                                        'ERT' => '',
                                        // 'RCA' => $ticketData->RCA,
                                        'RCA' => $ticketData->FK_RCA_ID ?? "",
                                        'RequestObject' => $RequestObject,
                                        'DBActivity' => $DBActivity,
                                        'RequestActivity' => $RequestActivity,
                                        'subCategory' => isset($fetchSubCategory) && isset($fetchSubCategory->INCIDENT_TYPE_NAME) ? $fetchSubCategory->INCIDENT_TYPE_NAME : $ticketData->SUB_CATEGORY,
                                        'neAffected' => isset($index['NE_AFFECTED2']) ? $index['NE_AFFECTED2'][$key] ?? null : null,
                                        'topology' => isset($index['topology']) ? $index['topology'][$key] ?? null : null
                                    ];
                                } else {
                                    // Log::info("Else Condition",[
                                    //     'PK_CIRCUIT_ID'=>$check_circuit_details->PK_CIRCUIT_ID ?? NULL,
                                    //     'CIRCUIT_ID'=>$check_circuit_details->CIRCUIT_ID ?? NULL
                                    // ]);
                                    $DBActivity = [
                                        'ActivityStatus' => 'PARTIAL UPDATE',
                                        'EventType' => 'REMOVE',
                                        'DBObject' => $check_circuit_details->toArray()
                                    ];
                                    $circuitDetails[] = [
                                        'transactionId' =>  $check_circuit_details->PK_CIRCUIT_ID,
                                        'ticketId' => $ticketData->INCIDENT_NUMBER,
                                        'ticketStatus' => $ticketData->STATUS_ID,
                                        'startTime' => $ticketData->EVENT_START_DATE,
                                        'endTime' => $ticketData->EVENT_ENT_DATE,
                                        'incidentDetails' => $ticketData->INCIDENT_DETAILS ?? null,
                                        'serviceImpact' => $serviceImpact->SERVICE_IMPACT_NAME ?? null,
                                        'ERT' => '',
                                        // 'RCA' => $ticketData->RCA,
                                        'RCA' => $ticketData->FK_RCA_ID ?? "",
                                        'RequestObject' => $RequestObject,
                                        'DBActivity' => $DBActivity,
                                        'RequestActivity' => [
                                            'ActivityStatus' => 'PARTIAL UPDATE',
                                            'EventType' => 'REMOVE',
                                            'RequestObject' => []
                                        ],
                                        'subCategory' => isset($fetchSubCategory) && isset($fetchSubCategory->INCIDENT_TYPE_NAME) ? $fetchSubCategory->INCIDENT_TYPE_NAME : $ticketData->SUB_CATEGORY,
                                        'neAffected' => isset($index['NE_AFFECTED2']) ? $index['NE_AFFECTED2'][$key] ?? null : null,
                                        'topology' => isset($index['topology']) ? $index['topology'][$key] ?? null : null
                                    ];

                                    $RequestActivity = [
                                        'ActivityStatus' => 'CREATE',
                                        'EventType' => 'CREATE',
                                        'RequestObject' => $RequestObject
                                    ];
                                    $circuitDetails[] = [
                                        'transactionId' =>  $check_circuit_details->PK_CIRCUIT_ID,
                                        'ticketId' => $ticketData->INCIDENT_NUMBER,
                                        'ticketStatus' => $ticketData->STATUS_ID,
                                        'startTime' => $ticketData->EVENT_START_DATE,
                                        'endTime' => $ticketData->EVENT_ENT_DATE,
                                        'incidentDetails' => $ticketData->INCIDENT_DETAILS ?? null,
                                        'serviceImpact' => $serviceImpact->SERVICE_IMPACT_NAME ?? null,
                                        'ERT' => '',
                                        // 'RCA' => $ticketData->RCA,
                                        'RCA' => $ticketData->FK_RCA_ID ?? "",
                                        'RequestObject' => $RequestObject,
                                        'DBActivity' => [
                                            'ActivityStatus' => 'CREATE',
                                            'EventType' => 'CREATE',
                                            'DBObject' => $check_circuit_details->toArray()
                                        ],
                                        'RequestActivity' => $RequestActivity,
                                        'subCategory' => isset($fetchSubCategory) && isset($fetchSubCategory->INCIDENT_TYPE_NAME) ? $fetchSubCategory->INCIDENT_TYPE_NAME : $ticketData->SUB_CATEGORY,
                                        'neAffected' => isset($index['NE_AFFECTED2']) ? $index['NE_AFFECTED2'][$key] ?? null : null,
                                        'topology' => isset($index['topology']) ? $index['topology'][$key] ?? null : null
                                    ];
                                }
                                CircuitDetails::where('PK_CIRCUIT_ID', $pk_circuit_id)
                                    ->where('FK_TICKET_ID', $index['ticket_id'])
                                    ->update([
                                        'CIRCUIT_ID' => $index['CIRCUIT_ID'][$key],
                                        'CIRCUIT_TYPE' => $index['CIRCUIT_TYPE'][$key],
                                        'CUSTOMER_IMPACTED' => $index['CUSTOMER_IMPACTED'][$key],
                                        'BANDWIDTH' => $index['BANDWIDTH'][$key],
                                        'updated_at' => now()
                                    ]);
                            } else {
                                $DBActivity = [
                                    'ActivityStatus' => 'CREATE',
                                    'EventType' => 'CREATE',
                                    'DBObject' => null
                                ];
                                $RequestActivity = [
                                    'ActivityStatus' => 'CREATE',
                                    'EventType' => 'CREATE',
                                    'RequestObject' => $RequestObject
                                ];
                                // If no existing record found, create a new one
                                $circuitData = CircuitDetails::create([
                                    'CIRCUIT_ID' => $index['CIRCUIT_ID'][$key],
                                    'CIRCUIT_TYPE' => $index['CIRCUIT_TYPE'][$key],
                                    'CUSTOMER_IMPACTED' => $index['CUSTOMER_IMPACTED'][$key],
                                    'BANDWIDTH' => $index['BANDWIDTH'][$key],
                                    'FK_TICKET_ID' => $index['ticket_id'], // Include FK_TICKET_ID
                                    'created_at' => now()
                                ]);

                                $circuitDetails[] = [
                                    'transactionId' =>  $circuitData->PK_CIRCUIT_ID,
                                    'ticketId' => $ticketData->INCIDENT_NUMBER ?? $index['ticket_id'] ?? null,
                                    'ticketStatus' => $ticketData->STATUS_ID,
                                    'startTime' => $ticketData->EVENT_START_DATE,
                                    'endTime' => $ticketData->EVENT_ENT_DATE,
                                    'incidentDetails' => $ticketData->INCIDENT_DETAILS ?? null,
                                    'serviceImpact' => $serviceImpact->SERVICE_IMPACT_NAME ?? null,
                                    'ERT' => '',
                                    // 'RCA' => $ticketData->RCA,
                                    'RCA' => $ticketData->FK_RCA_ID ?? "",
                                    'RequestObject' => $RequestObject,
                                    'DBActivity' => $DBActivity,
                                    'RequestActivity' => $RequestActivity,
                                    'subCategory' => isset($fetchSubCategory) && isset($fetchSubCategory->INCIDENT_TYPE_NAME) ? $fetchSubCategory->INCIDENT_TYPE_NAME : $ticketData->SUB_CATEGORY,
                                    'neAffected' => isset($index['NE_AFFECTED2']) ? $index['NE_AFFECTED2'][$key] ?? null : null,
                                    'topology' => isset($index['topology']) ? $index['topology'][$key] ?? null : null
                                ];
                            }
                        }
                    }
                }


                if (!empty($index['topology']) && isset($index['topology'])) {
                    foreach ((array)$index['topology'] as $key => $value) {

                        if (isset($value) && !empty($value)) {

                            if (isset($index['PK_TOPOLOGY_ID'][$key]) && !empty($index['PK_TOPOLOGY_ID'][$key])) {

                                $check_route_details = TopologyAffectedDetails::where('PK_TOPOLOGY_ID', $index['PK_TOPOLOGY_ID'][$key])
                                    ->where('FK_TICKET_ID', $index['ticket_id'])->first();

                                if (!empty($check_route_details)) {

                                    if ($check_route_details->TOPOLOGY == $index['topology'][$key]) {

                                        TopologyAffectedDetails::where('PK_TOPOLOGY_ID', $index['PK_TOPOLOGY_ID'][$key])
                                            ->update(
                                                [
                                                    'FK_TICKET_ID' =>  $index['ticket_id'],
                                                    'TOPOLOGY' => $index['topology'][$key],
                                                    'A_NODE' => $index['a_node'][$key],
                                                    'Z_NODE' => $index['z_node'][$key],
                                                    'LAYER_RATE' => $index['layer_rate'][$key],
                                                    // 'SMP_ID_A' => $index['smp_id_a'][$key] ?? null,
                                                    // 'SMP_ID_B' => $index['smp_id_b'][$key] ?? null,
                                                    // 'SUB_LOCATION_NAME_A' => $index['sub_location_name_a'][$key] ?? null,
                                                    // 'SUB_LOCATION_NAME_B' => $index['sub_location_name_b'][$key] ?? null,
                                                    'updated_at' => NOW()
                                                ]
                                            );
                                    } else {

                                        TopologyAffectedDetails::create([
                                            'FK_TICKET_ID' =>  $index['ticket_id'],
                                            'TOPOLOGY' => $index['topology'][$key],
                                            'A_NODE' => $index['a_node'][$key],
                                            'Z_NODE' => $index['z_node'][$key],
                                            'LAYER_RATE' => $index['layer_rate'][$key],
                                            // 'SMP_ID_A' => $index['smp_id_a'][$key] ?? null,
                                            // 'SMP_ID_B' => $index['smp_id_b'][$key] ?? null,
                                            // 'SUB_LOCATION_NAME_A' => $index['sub_location_name_a'][$key] ?? null,
                                            // 'SUB_LOCATION_NAME_B' => $index['sub_location_name_b'][$key] ?? null,
                                            'created_at' => NOW()

                                        ]);
                                    }
                                } else {

                                    TopologyAffectedDetails::create([
                                        'FK_TICKET_ID' =>  $index['ticket_id'],
                                        'TOPOLOGY' => $index['topology'][$key],
                                        'A_NODE' => $index['a_node'][$key],
                                        'Z_NODE' => $index['z_node'][$key],
                                        'LAYER_RATE' => $index['layer_rate'][$key],
                                        // 'SMP_ID_A' => $index['smp_id_a'][$key] ?? null,
                                        // 'SMP_ID_B' => $index['smp_id_b'][$key] ?? null,
                                        // 'SUB_LOCATION_NAME_A' => $index['sub_location_name_a'][$key] ?? null,
                                        // 'SUB_LOCATION_NAME_B' => $index['sub_location_name_b'][$key] ?? null,
                                        'created_at' => NOW()

                                    ]);
                                }
                            } else {

                                if (is_numeric($index['topology'][$key])) {
                                    TopologyAffectedDetails::create([
                                        'FK_TICKET_ID' =>  $index['ticket_id'],
                                        'TOPOLOGY' => $index['topology'][$key],
                                        'A_NODE' => $index['a_node'][$key],
                                        'Z_NODE' => $index['z_node'][$key],
                                        'LAYER_RATE' => $index['layer_rate'][$key],
                                        // 'SMP_ID_A' => $index['smp_id_a'][$key] ?? null,
                                        // 'SMP_ID_B' => $index['smp_id_b'][$key] ?? null,
                                        // 'SUB_LOCATION_NAME_A' => $index['sub_location_name_a'][$key] ?? null,
                                        // 'SUB_LOCATION_NAME_B' => $index['sub_location_name_b'][$key] ?? null,
                                        'created_at' => NOW()

                                    ]);
                                }
                            }
                        } else {

                            if (is_numeric($index['topology'][$key])) {
                                TopologyAffectedDetails::create([
                                    'FK_TICKET_ID' =>  $index['ticket_id'],
                                    'TOPOLOGY' => $index['topology'][$key],
                                    'A_NODE' => $index['a_node'][$key],
                                    'Z_NODE' => $index['z_node'][$key],
                                    'LAYER_RATE' => $index['layer_rate'][$key],
                                    // 'SMP_ID_A' => $index['smp_id_a'][$key] ?? null,
                                    // 'SMP_ID_B' => $index['smp_id_b'][$key] ?? null,
                                    // 'SUB_LOCATION_NAME_A' => $index['sub_location_name_a'][$key] ?? null,
                                    // 'SUB_LOCATION_NAME_B' => $index['sub_location_name_b'][$key] ?? null,
                                    'created_at' => NOW()

                                ]);
                            }
                        }
                    }
                }

                //dd(DB::getQueryLog());
                if (($index['ACTIVE_STATUS'] == 2) && ($index['ticket_id'] != '')) {
                    //DB::enableQueryLog();
                    $ticketData->SERVICE_REQUEST = isset($index['service_request']) ? $index['service_request'] : null;
                    $ticketData->FK_VENDOR_ID = isset($index['vendor_id']) ? $index['vendor_id'] : null;
                    $ticketData->OM_BY = isset($index['om_by']) ? $index['om_by'] : null;
                    $ticketData->FK_CUSTOMER_CLASSIFIC = isset($index['customer_classific']) ? $index['customer_classific'] : null;
                    $ticketData->FK_ROUTE_ID = isset($index['route_name']) ? $index['route_name'] : null;
                    $ticketData->TTR = isset($index['TTR']) ? $index['TTR'] : null;
                    $ticketData->SATTR = isset($index['SATTR']) ? $index['SATTR'] : null;
                    $ticketData->FK_DELAY_REASON = isset($index['delay_reason']) ? $index['delay_reason'] : null;
                    $ticketData->RESOLUTION = isset($index['resolution']) ? $index['resolution'] : null;
                    $ticketData->PLATFORM = isset($index['platform']) ? $index['platform'] : null;
                    $ticketData->FK_SUB_PLATEFORM_ID = isset($index['sub_platform_id']) ? $index['sub_platform_id'] : null;
                    $ticketData->FK_REMEDY_ID = isset($index['remedy_id']) ? $index['remedy_id'] : null;
                    $ticketData->FK_RFO = isset($index['RFO']) ? $index['RFO'] : null;
                    $ticketData->FK_RCA_ID = isset($index['FK_RCA_ID']) ? $index['FK_RCA_ID'] : null;
                    $ticketData->EVENT_ENT_DATE = $event_end_date ?? null;
                    $ticketData->RELATED_RECODRS_TAB = isset($index['related_records_tab']) ? $index['related_records_tab'] : null;
                    $ticketData->CELL_OUTAGE = isset($index['cell_outage']) ? $index['cell_outage'] : null;
                    $ticketData->BTS_ID = isset($index['bts_id']) ? $index['bts_id'] : null;
                    $ticketData->FAULT_SERIAL_NO = isset($index['fault_serial_no']) ? $index['fault_serial_no'] : null;
                    $ticketData->NEW_HW_SERIAL_NO = isset($index['new_hw_serial_no']) ? $index['new_hw_serial_no'] : null;
                    $ticketData->ORGINATING_NO = isset($index['originating_no']) ? $index['originating_no'] : null;
                    $ticketData->TERMINATING_SECTIONB = isset($index['terminating_sectionb']) ? $index['terminating_sectionb'] : null;
                    $ticketData->FAULT_ESC_TIME = isset($fault_esc_time) ? $fault_esc_time : null;
                    $ticketData->FK_LOCATION_ID = isset($index['LOCATION_ID']) ? $index['LOCATION_ID'] : "";
                    $ticketData->SERVICE_LOCATION_ID = isset($index['service_location_id']) ? $index['service_location_id'] : "";
                    $ticketData->LOCATION_CONNECTIVITY = isset($index['location_connectivity']) ? $index['location_connectivity'] : null;
                    $ticketData->LOCATION_TYPE = isset($index['location_type']) ? $index['location_type'] : null;
                    $ticketData->LOCATION_OWNER = isset($index['location_owner']) ? $index['location_owner'] : null;
                    $ticketData->FMS_O_M_By = isset($index['FMS_O_M_By']) ? $index['FMS_O_M_By'] : null;
                    $ticketData->RMA_NUMBER = isset($index['rma_number']) ? $index['rma_number'] : null;
                    $ticketData->FAULT_INFO_RECEIVED = isset($index['fault_info_received']) ? $index['fault_info_received'] : null;
                    $ticketData->FAULT_REVERT_TIME = isset($fault_revert_time) ? $fault_revert_time : null;
                    $ticketData->FIBER_CUT_TYPE = isset($index['fiber_cut_type']) ? $index['fiber_cut_type'] : null;
                    $ticketData->FRT_LOCATION = isset($index['osp_frt_location']) ? $index['osp_frt_location'] : null;
                    $ticketData->ROUTE_STATE = isset($index['route_state']) ? $index['route_state'] : null;
                    $ticketData->LAST_ACTION = isset($last_action) ? $last_action : null;
                    $ticketData->NEXT_ACTION = isset($next_action) ? $next_action : null;
                    $ticketData->STP_DETAILS = isset($index['stp_and_details']) ? $index['stp_and_details'] : null;
                    $ticketData->PLATFORM_OSP = isset($index['platform_osp']) ? $index['platform_osp'] : null;
                    $ticketData->SERVICE_LOCATION_ID = isset($index['service_location_id']) ? $index['service_location_id'] : null;
                    $ticketData->MATERIAL_CODE = isset($index['material_code']) ? $index['material_code'] : null;
                    $ticketData->MATERIAL_DIS = isset($index['material_dis']) ? $index['material_dis'] : null;
                    $ticketData->FAULT_INFORMED_TO = $index['FAULT_INFORMED_TO'] ?? null;
                    $ticketData->FAULT_RESTORATION_TYPE = isset($index['FAULT_RESTORATION_TYPE']) ? $index['FAULT_RESTORATION_TYPE'] : null;
                    $ticketData->INCIDENT_REMARK = isset($index['INCIDENT_REMARK']) ? $index['INCIDENT_REMARK'] : null;
                    $ticketData->FK_REGION = isset($index['REGION']) ? $index['REGION'] : null;
                    $ticketData->FK_CIRCLE = isset($index['CIRCLE']) ? $index['CIRCLE'] : null;
                    $ticketData->FK_CLUSTER_ID = isset($index['CLUSTER']) ? $index['CLUSTER'] : null;
                    $ticketData->FK_CITY_ID = isset($index['TOWN']) ? $index['TOWN'] : null;
                    //dd(DB::getQueryLog());
                }

                if ($prevTicketData->USER_FORWARDED_WORK_GROUP_ID != $index['USER_FORWARDED_WORK_GROUP_ID']) {
                    $ticketData->PREV_FORWARDED_WORK_GROUP_ID = !empty($prevTicketData->USER_FORWARDED_WORK_GROUP_ID) ? $prevTicketData->USER_FORWARDED_WORK_GROUP_ID : $prevTicketData->USER_WORK_GROUP_ID;
                    TKTForwordHistory::create([
                        'FK_TICKET_ID' => $prevTicketData->PK_INCIDENT_ID,
                        'FROM' => $ticketData->PREV_FORWARDED_WORK_GROUP_ID,
                        'TO' =>  $index['USER_FORWARDED_WORK_GROUP_ID'],
                        'FK_USER_ID' => auth()->user()->UserID,
                    ]);
                }
                if ($index['ticket_id']) {
                    $user = Auth::guard('web')->user();

                    // dd([
                    //     $prevTicketData->STATUS_ID,
                    //     $ticketData->STATUS_ID,
                    //     $prevTicketData->STATUS_ID != $ticketData->STATUS_ID
                    // ]);

                    // if ($prevTicketData->STATUS_ID != $ticketData->STATUS_ID) {
                    if ($prevTicketData->STATUS_ID != $index['ACTIVE_STATUS']) {


                        // Log::info("inside if status", [
                        //     "active_status" => $index['ACTIVE_STATUS']
                        // ]);

                        if (isset($index['attachment'])) {
                            unset($index['attachment']);
                        }
                        // $ticketData = TicketMaster::where('PK_INCIDENT_ID',  $index['ticket_id'])->first();
                        dispatch(new TicketEscalationMessage($index, $user));

                        if ($index['ACTIVE_STATUS'] == 1) {
                            $TKT_TYPE = 'FLT';
                        } else if ($index['ACTIVE_STATUS'] == 2) {
                            $TKT_TYPE = 'RST';
                        } else if ($index['ACTIVE_STATUS'] == 3) {
                            $TKT_TYPE = 'CLS';
                        } else if ($index['ACTIVE_STATUS'] == 4) {
                            $TKT_TYPE = 'RON';
                        }

                        $checkAuditTicket = SmsAuditTrial::where('TICKET_NUMBER', $index['ticket_number'])
                            ->where('TKT_TYPE', $TKT_TYPE)->select('TICKET_NUMBER')
                            ->first();

                        if (empty($checkAuditTicket)) {
                            SmsAuditTrial::create([
                                'TICKET_NUMBER' => $index['ticket_number'],
                                'TKT_TYPE' => $TKT_TYPE,
                                'SMS_SENT_TIME' => now()
                            ]);
                        }

                        if ($index['ACTIVE_STATUS'] == 2) {
                            // Log::info("inside if resolved status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);
                            if (empty($prevTicketData->TKT_RESOLVED_TIME)) {
                                $ticketData->TKT_RESOLVED_TIME = date('Y-m-d H:i:s');
                                $ticketData->FK_RESOLVED_BY = $user->UserID;
                            }
                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Resolved',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} successfully resolved on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "Your ticket with ID " . $index["ticket_number"] . " has been successfully resolved on " . date('d-m-Y h:i:s');
                        } else if ($index['ACTIVE_STATUS'] == 3) {

                            // Log::info("inside if closed status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);

                            if (empty($prevTicketData->TKT_CLOSED_TIME)) {
                                $ticketData->TKT_CLOSED_TIME = date('Y-m-d H:i:s');
                                $ticketData->FK_CLOSED_BY = $user->UserID;
                            }

                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Closed',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} successfully closed on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "Your ticket with ID " . $index["ticket_number"] . " has been successfully closed on " . date('d-m-Y h:i:s');
                        } else if ($index['ACTIVE_STATUS'] == 4) {

                            // Log::info("inside if reopen status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);


                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Reopened',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} successfully reopened on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "Your ticket with ID " . $index["ticket_number"] . " has been successfully reopened on " . date('d-m-Y h:i:s');
                        }

                        if ($prevTicketData->STATUS_ID == 4 && $index['ACTIVE_STATUS'] == 2) {

                            // Log::info("inside if TKT_REOPEN_RESOLVED_TIME", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);

                            $ticketData->TKT_REOPEN_RESOLVED_TIME = now();
                        }
                    } else {

                        if ($index['ACTIVE_STATUS'] == 2 && empty($prevTicketData->TKT_RESOLVED_TIME)) {
                            // Log::info("inside else if resolved status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);

                            $ticketData->TKT_RESOLVED_TIME = date('Y-m-d H:i:s');
                            $ticketData->FK_RESOLVED_BY = $user->UserID;

                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Resolved',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} successfully resolved on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "Your ticket with ID " . $index["ticket_number"] . " has been successfully resolved on " . date('d-m-Y h:i:s');
                        } else if ($index['ACTIVE_STATUS'] == 3 && empty($prevTicketData->TKT_CLOSED_TIME)) {

                            // Log::info("inside else if closed status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);

                            $ticketData->TKT_CLOSED_TIME = date('Y-m-d H:i:s');
                            $ticketData->FK_CLOSED_BY = $user->UserID;

                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Closed',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} successfully closed on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "Your ticket with ID " . $index["ticket_number"] . " has been successfully closed on " . date('d-m-Y h:i:s');
                        } else if ($index['ACTIVE_STATUS'] == 4) {

                            // Log::info("inside else if reopen status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);

                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Reopened',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} successfully reopened on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "Your ticket with ID " . $index["ticket_number"] . " has been successfully reopened on " . date('d-m-Y h:i:s');
                        } else {
                            // Log::info("inside else  modified status", [
                            //     "active_status" => $index['ACTIVE_STATUS']
                            // ]);

                            //Updating RESOLVED_TIME every time to keep event end time less then RESOLVED_TIME syggested by Sajit - modified by Jiaul
                            // if ($index['ACTIVE_STATUS'] == 2) {
                            //     $ticketData->TKT_RESOLVED_TIME = date('Y-m-d H:i:s');
                            //     $ticketData->FK_RESOLVED_BY = $user->UserID;
                            // }
                            event(new TicketAuditTrack($ticketData, $user, [
                                'event_name' => 'Ticket Modified',
                                'event_description' => "Ticket {$ticketData->INCIDENT_NUMBER} modified on " . date('d-m-Y \A\t h:i:s A'),
                                'event_type' => 'ticket',
                            ]));
                            $message = "The status of your ticket with ID " . $index["ticket_number"] . " has been modified on " . date('d-m-Y h:i:s');
                        }
                    }
                }

                $ticketData->save();
                //update ticket status send to UA
                if (!empty($ticketData->UA_USER_ID) || !empty($ticketData->UA_USER_NAME)) {
                    // $this->ua_ticket_status_update($index);
                    dispatch(new UATicketUpdate($ticketData));
                }

                // try {
                //     $this->meUpdateTicket($index);
                // } catch (\Throwable $th) {
                //     Log::info("Error on update ME Ticket" . $th);
                // }

                // logic for collecting circuite details and dispatching ConnectToTataCRM job;

                // logic for collecting circuite details and dispatching ConnectToTataCRM job;
                // if (!empty($index['CIRCUIT_ID']) && isset($index['CIRCUIT_ID'])) {

                // Log::info("circuitDetails".json_encode($circuitDetails));
                if (!empty($circuitDetails)) {
                    dispatch(new ConnectToTataCRM($circuitDetails));
                }
                // }
                return response()->json(['success' => $message]);
            } catch (\Throwable $th) {

                Log::error($th);
                return response()->json(['error' => 'Failed to Update Ticket'], 400);
            }
        }
    }