'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Radix from '@radix-ui/react-radio-group';
import { format } from 'date-fns';
import Airtable from 'airtable';

const BootcampForm = () => {
  const { register, handleSubmit, control, watch, setValue, getValues, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [tshirtOther, setTshirtOther] = useState(false);
  const [hospitalised, setHospitalised] = useState(false);
  const [injuries, setInjuries] = useState(false);
  const [chronicIllness, setChronicIllness] = useState(false);
  const [medication, setMedication] = useState(false);
  const [limitations, setLimitations] = useState(false);
  const [allergies, setAllergies] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async (data: any) => {
    console.log(data);
    const base = new Airtable({ apiKey: 'YOUR_AIRTABLE_API_KEY' }).base('YOUR_BASE_ID');

    base('Table 1').create([
      {
        fields: {
          ...data
        }
      }
    ], function (err: any) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Form submitted successfully');
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Bootcamp Permission Form</h2>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">{step}/6</span>
            <span className="text-xs font-semibold text-gray-700">Step {step}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(step / 6) * 100}%` }}></div>
          </div>
        </div>

        {step === 1 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Boot's Information</h3>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Full Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('fullName', { required: true })}
                className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">Full Name is required.</p>}
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-gray-700">Gender<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Male"
                    {...register('gender', { required: true })}
                    className="mr-2"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="Female"
                    {...register('gender', { required: true })}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">Gender is required.</p>}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700">Date of Birth<span className="text-red-500">*</span></label>
              <input
                type="date"
                {...register('dob', { required: true })}
                className={`w-full px-3 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded`}
                onChange={(e) => setValue('age', calculateAge(e.target.value))}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">Date of Birth is required.</p>}
            </div>

            {/* Age at time of bootcamp */}
            <div className="mb-4">
              <label className="block text-gray-700">Age at time of bootcamp</label>
              <input
                type="text"
                {...register('age')}
                value={calculateAge(watch('dob'))}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>

            {/* Residential Address */}
            <div className="mb-4">
              <label className="block text-gray-700">Residential Address<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('address', { required: true })}
                className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">Residential Address is required.</p>}
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('contactNumber', { required: true })}
                className={`w-full px-3 py-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">Contact Number is required.</p>}
            </div>

            {/* T-shirt Size */}
            <div className="mb-4">
              <label className="block text-gray-700">T-shirt Size<span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Other'].map(size => (
                  <label key={size} className="mr-4">
                    <input
                      type="radio"
                      value={size}
                      {...register('tshirtSize', { required: true })}
                      className="mr-2"
                      onChange={() => setTshirtOther(size === 'Other')}
                    />
                    {size}
                  </label>
                ))}
              </div>
              {errors.tshirtSize && <p className="text-red-500 text-xs mt-1">T-shirt Size is required.</p>}
              {tshirtOther && (
                <input
                  type="text"
                  {...register('otherTshirtSize')}
                  placeholder="Please specify"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
            </div>

            {/* Can the Boot swim? */}
            <div className="mb-4">
              <label className="block text-gray-700">Is the Boot able to swim?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('canSwim', { required: true })}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('canSwim', { required: true })}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {errors.canSwim && <p className="text-red-500 text-xs mt-1">Please select if the Boot can swim.</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Parent / Guardian Information</h3>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Full Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('parentFullName', { required: true })}
                className={`w-full px-3 py-2 border ${errors.parentFullName ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.parentFullName && <p className="text-red-500 text-xs mt-1">Full Name is required.</p>}
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('parentContactNumber', { required: true })}
                className={`w-full px-3 py-2 border ${errors.parentContactNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.parentContactNumber && <p className="text-red-500 text-xs mt-1">Contact Number is required.</p>}
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label className="block text-gray-700">Email Address<span className="text-red-500">*</span></label>
              <input
                type="email"
                {...register('parentEmail', { required: true })}
                className={`w-full px-3 py-2 border ${errors.parentEmail ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.parentEmail && <p className="text-red-500 text-xs mt-1">Email Address is required.</p>}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Church Information</h3>
            {/* Which church do you attend? */}
            <div className="mb-4">
              <label className="block text-gray-700">Which church do you attend?<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('church', { required: true })}
                className={`w-full px-3 py-2 border ${errors.church ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.church && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>

            {/* Pastor's Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Pastor's Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('pastorName', { required: true })}
                className={`w-full px-3 py-2 border ${errors.pastorName ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.pastorName && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>

            {/* Pastor's Contact Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Pastor's Contact Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('pastorContactNumber', { required: true })}
                className={`w-full px-3 py-2 border ${errors.pastorContactNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.pastorContactNumber && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
            <p className="mb-4">Please provide details of two emergency contacts</p>

            <h4 className="text-lg font-semibold mb-2">Primary Emergency</h4>
            {/* Primary Emergency - Contact Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('primaryEmergencyContactName', { required: true })}
                className={`w-full px-3 py-2 border ${errors.primaryEmergencyContactName ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.primaryEmergencyContactName && <p className="text-red-500 text-xs mt-1">Contact Name is required.</p>}
            </div>

            {/* Primary Emergency - Contact Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('primaryEmergencyContactNumber', { required: true })}
                className={`w-full px-3 py-2 border ${errors.primaryEmergencyContactNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.primaryEmergencyContactNumber && <p className="text-red-500 text-xs mt-1">Contact Number is required.</p>}
            </div>

            <h4 className="text-lg font-semibold mb-2">Secondary Emergency</h4>
            {/* Secondary Emergency - Contact Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('secondaryEmergencyContactName', { required: true })}
                className={`w-full px-3 py-2 border ${errors.secondaryEmergencyContactName ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.secondaryEmergencyContactName && <p className="text-red-500 text-xs mt-1">Contact Name is required.</p>}
            </div>

            {/* Secondary Emergency - Contact Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('secondaryEmergencyContactNumber', { required: true })}
                className={`w-full px-3 py-2 border ${errors.secondaryEmergencyContactNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.secondaryEmergencyContactNumber && <p className="text-red-500 text-xs mt-1">Contact Number is required.</p>}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Health History</h3>

            {/* Hospitalised */}
            <div className="mb-4">
              <label className="block text-gray-700">In the past 12 months, have you been hospitalised?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('hospitalised', { required: true })}
                    className="mr-2"
                    onChange={() => setHospitalised(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('hospitalised', { required: true })}
                    className="mr-2"
                    onChange={() => setHospitalised(false)}
                  />
                  No
                </label>
              </div>
              {errors.hospitalised && <p className="text-red-500 text-xs mt-1">Please select an option.</p>}
              {hospitalised && (
                <input
                  type="text"
                  {...register('hospitalisedDetails')}
                  placeholder="Please provide further details"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
            </div>

            {/* Injuries */}
            <div className="mb-4">
              <label className="block text-gray-700">In the past 12 months, have you had any injuries requiring medical treatment?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('injuries', { required: true })}
                    className="mr-2"
                    onChange={() => setInjuries(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('injuries', { required: true })}
                    className="mr-2"
                    onChange={() => setInjuries(false)}
                  />
                  No
                </label>
              </div>
              {errors.injuries && <p className="text-red-500 text-xs mt-1">Please select an option.</p>}
              {injuries && (
                <input
                  type="text"
                  {...register('injuriesDetails')}
                  placeholder="Please provide further details"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
            </div>

            {/* Chronic Illness */}
            <div className="mb-4">
              <label className="block text-gray-700">Have you had a chronic illness?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('chronicIllness', { required: true })}
                    className="mr-2"
                    onChange={() => setChronicIllness(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('chronicIllness', { required: true })}
                    className="mr-2"
                    onChange={() => setChronicIllness(false)}
                  />
                  No
                </label>
              </div>
              {errors.chronicIllness && <p className="text-red-500 text-xs mt-1">Please select an option.</p>}
              {chronicIllness && (
                <input
                  type="text"
                  {...register('chronicIllnessDetails')}
                  placeholder="Please provide further details"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
            </div>

            {/* Medication */}
            <div className="mb-4">
              <label className="block text-gray-700">Do you take medication regularly?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('medication', { required: true })}
                    className="mr-2"
                    onChange={() => setMedication(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('medication', { required: true })}
                    className="mr-2"
                    onChange={() => setMedication(false)}
                  />
                  No
                </label>
              </div>
              {errors.medication && <p className="text-red-500 text-xs mt-1">Please select an option.</p>}
              {medication && (
                <textarea
                  {...register('medicationDetails')}
                  placeholder="Please provide further details"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
              <p className="text-xs text-gray-600 mt-2">
                All necessary medications must be bought in commercially labelled packaging (NO loose pills in plastic bag).
                These will be signed in with medical staff on registration and dispensed by medical staff during the camp. Excess medications will be
                returned to Boots at the end of the camp.
              </p>
            </div>

            {/* Limitations */}
            <div className="mb-4">
              <label className="block text-gray-700">Do you have any limitations to participate in sports/physical activities?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('limitations', { required: true })}
                    className="mr-2"
                    onChange={() => setLimitations(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('limitations', { required: true })}
                    className="mr-2"
                    onChange={() => setLimitations(false)}
                  />
                  No
                </label>
              </div>
              {errors.limitations && <p className="text-red-500 text-xs mt-1">Please select an option.</p>}
              {limitations && (
                <input
                  type="text"
                  {...register('limitationsDetails')}
                  placeholder="Please provide further details"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
            </div>

            {/* Allergies */}
            <div className="mb-4">
              <label className="block text-gray-700">Are you allergic to any medications, food, insects, or plants?<span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('allergies', { required: true })}
                    className="mr-2"
                    onChange={() => setAllergies(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="No"
                    {...register('allergies', { required: true })}
                    className="mr-2"
                    onChange={() => setAllergies(false)}
                  />
                  No
                </label>
              </div>
              {errors.allergies && <p className="text-red-500 text-xs mt-1">Please select an option.</p>}
              {allergies && (
                <input
                  type="text"
                  {...register('allergiesDetails')}
                  placeholder="Please provide further details"
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                />
              )}
            </div>

            {/* Last Booster Year */}
            <div className="mb-4">
              <label className="block text-gray-700">Year of last tetanus shot/booster?<span className="text-red-500">*</span></label>
              <input
                type="number"
                {...register('lastBoosterYear', { required: true })}
                className={`w-full px-3 py-2 border ${errors.lastBoosterYear ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.lastBoosterYear && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>

            {/* Family Physician */}
            <div className="mb-4">
              <label className="block text-gray-700">Name of family physician<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('familyPhysician', { required: true })}
                className={`w-full px-3 py-2 border ${errors.familyPhysician ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.familyPhysician && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>

            {/* Family Physician Contact Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Contact number of family physician<span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('familyPhysicianContactNumber', { required: true })}
                className={`w-full px-3 py-2 border ${errors.familyPhysicianContactNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
              {errors.familyPhysicianContactNumber && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Review Your Information</h3>
            <p className="mb-4">Please review all the information you have entered.</p>

            {/* Display all the entered information for review */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Boot's Information</h4>
              <p><strong>Full Name:</strong> {getValues('fullName')}</p>
              <p><strong>Gender:</strong> {getValues('gender')}</p>
              <p><strong>Date of Birth:</strong> {getValues('dob')}</p>
              <p><strong>Age at time of bootcamp:</strong> {calculateAge(getValues('dob'))}</p>
              <p><strong>Residential Address:</strong> {getValues('address')}</p>
              <p><strong>Contact Number:</strong> {getValues('contactNumber')}</p>
              <p><strong>T-shirt Size:</strong> {getValues('tshirtSize')}{getValues('tshirtSize') === 'Other' && ` - ${getValues('otherTshirtSize')}`}</p>
              <p><strong>Can Swim:</strong> {getValues('canSwim')}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold">Parent / Guardian Information</h4>
              <p><strong>Full Name:</strong> {getValues('parentFullName')}</p>
              <p><strong>Contact Number:</strong> {getValues('parentContactNumber')}</p>
              <p><strong>Email Address:</strong> {getValues('parentEmail')}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold">Church Information</h4>
              <p><strong>Church:</strong> {getValues('church')}</p>
              <p><strong>Pastor's Name:</strong> {getValues('pastorName')}</p>
              <p><strong>Pastor's Contact Number:</strong> {getValues('pastorContactNumber')}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold">Emergency Contact</h4>
              <h5 className="font-semibold">Primary Emergency</h5>
              <p><strong>Contact Name:</strong> {getValues('primaryEmergencyContactName')}</p>
              <p><strong>Contact Number:</strong> {getValues('primaryEmergencyContactNumber')}</p>
              <h5 className="font-semibold">Secondary Emergency</h5>
              <p><strong>Contact Name:</strong> {getValues('secondaryEmergencyContactName')}</p>
              <p><strong>Contact Number:</strong> {getValues('secondaryEmergencyContactNumber')}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold">Health History</h4>
              <p><strong>Hospitalised:</strong> {getValues('hospitalised')}</p>
              {getValues('hospitalised') === 'Yes' && <p><strong>Details:</strong> {getValues('hospitalisedDetails')}</p>}
              <p><strong>Injuries:</strong> {getValues('injuries')}</p>
              {getValues('injuries') === 'Yes' && <p><strong>Details:</strong> {getValues('injuriesDetails')}</p>}
              <p><strong>Chronic Illness:</strong> {getValues('chronicIllness')}</p>
              {getValues('chronicIllness') === 'Yes' && <p><strong>Details:</strong> {getValues('chronicIllnessDetails')}</p>}
              <p><strong>Medication:</strong> {getValues('medication')}</p>
              {getValues('medication') === 'Yes' && <p><strong>Details:</strong> {getValues('medicationDetails')}</p>}
              <p><strong>Limitations:</strong> {getValues('limitations')}</p>
              {getValues('limitations') === 'Yes' && <p><strong>Details:</strong> {getValues('limitationsDetails')}</p>}
              <p><strong>Allergies:</strong> {getValues('allergies')}</p>
              {getValues('allergies') === 'Yes' && <p><strong>Details:</strong> {getValues('allergiesDetails')}</p>}
              <p><strong>Last Booster Year:</strong> {getValues('lastBoosterYear')}</p>
              <p><strong>Family Physician:</strong> {getValues('familyPhysician')}</p>
              <p><strong>Family Physician Contact Number:</strong> {getValues('familyPhysicianContactNumber')}</p>
            </div>
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 rounded">
              Previous
            </button>
          )}
          {step < 6 && (
            <button type="button" onClick={nextStep} className="bg-blue-500 text-white py-2 px-4 rounded">
              Next
            </button>
          )}
          {step === 6 && (
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BootcampForm;
