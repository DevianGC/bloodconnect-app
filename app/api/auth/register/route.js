import { NextResponse } from 'next/server';
import { hashPassword } from '../../../../lib/auth';
import { createDonor, getDonorByEmail } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { 
      name, 
      email, 
      password, 
      bloodType, 
      contact, 
      address, 
      barangay, 
      lastDonation,
      emailAlerts 
    } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password || !bloodType || !contact || !address || !barangay) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getDonorByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      bloodType,
      contact,
      address,
      barangay,
      lastDonation: lastDonation || null,
      emailAlerts: emailAlerts !== undefined ? emailAlerts : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const createdUser = await createDonor(newUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = createdUser;

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
