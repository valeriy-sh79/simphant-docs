---
title: Bodies
sidebar_label: Bodies
---

![](media/365861054dac702ce710b633d5059192.png)

## Import CAD models

The CAD models can be imported to the program as .obj or .stl file.

![](media/8af957954fbd9a50629b13a63937967a.png) ![](media/a4f224e5126ea1c0ef30182499065635.png)

Right after the import, the geometry and mass properties of each rigid body are automatically calculated.

## Rigid Body Properties

The "Body Properties" panel can be opened by clicking the "Body" button or by double-clicking on the Body in the Tree-Hierarchy on the left side of the window.

Once the CAD model is imported or created by the Primitives toolbar, the mass properties are immediately calculated and assigned to each body based on the CAD mesh data and default steel density: ρ = 7850 kg\*m\^3:

-   Volume (mm\^3),
-   Mass (kg),
-   XYZ-coordinates of its Center of Gravity (CoG) relative to the Global reference frame (mm),
-   Inertia Tensor with regards to body’s CoG (kg\*mm²),
-   Principal Moments of Inertia (kg\*mm²): I_xx, I_yy, I_zz,
-   Rotation Matrix of body’s Principal Axes relative to the Global RF,
-   Rotational angles of the body’s principal axes in Global RF (Yaw-Pitch-Roll).

By demand, the density can be changed, then all mass properties will be immediately updated.

By selection the ‘Apply Overall Density’ checkbox (and click ‘Apply’ button), the density and mass properties will be updated for all rigid bodies in the model.

![](media/330a6a87c1a5334dcdf3eff7a48d0a98.png)

A specific color can be assigned to each body individually or to all bodies in the project.

![](media/6c47473edba417880684835586340bce.png)

By demand, a random color can be assigned to all bodies.

The body can be hidden (‘Visible’ button) or disabled (‘Enabled’ button) and not considered in the simulation.

## The Gravity

Once the CAD model is imported or created by the Primitives toolbar, the gravity force is assigned to each body based on the calculated mass properties and the global gravity vector.

![](media/91838d99d081d9a4bb1970b980eaa581.png)

By default, the gravity vector is set to: $$\mathbf{g \ } = \  \left\lbrack 0 , \  - 9 . 8 1 , \  0 \right\rbrack^{T}$$ (m/s\^2)

By demand, the gravity can be changed or deactivated in the Gravity section of the Force Property panel.

![](media/34391e49175bfac540d9481f4f90904f.png)

The gravity force appears as a green arrow for each body pointing from its CoG.

## Initial linear and angular velocities

By default, the Initial linear and angular velocities of each body are set to 0.0.

By demand, the initial velocities can be updated to the required values, which will be considered at time point t=0 during simulation. The ‘Initial Velocity’ section is available on the ‘Body Properties’ panel.

![](media/c6a7ec85546ea8e20b71a271718e40d1.png)

Since the rotations are solved in local body-fixed reference frame in the solver, the body initial angular velocity is also defined as the vector in the Local body RF for convenience.

Attention / Tip! Unlike a single body, the initial velocities for coupled bodies must be specified with caution. If the velocities of constrained bodies do not match, this can lead to inaccurate simulation results, high reactions in the joints or even solver crash.

## Reference Frame

Reference Frame (RF) is a coordinate system, whose origin and orientation have been specified in physical space relative to the Global reference frame.

![](media/c6609fa06a1198f7139e7534f5188357.png)

The reference frame is the fundamental unit of the simulation system, since all the basic components (bodies, forces, joints, springs) are defined relative to the reference frame.

The reference frame is defined by 6 parameters: X, Y, Z -coordinates and X_rot, Y_rot, Z_rot rotational angles relative to the Global RF.

The RF can be copied, shifted and rotated relative to the Global and Local RF by the controls on the “RF Properties” panel. The "RF Properties" panel can be opened by click the "Ref.Frame" button or by double-click on the RF in the Tree-Hierarchy on the left side of the main window.

![](media/01a314028ca7e22a927d9bf8afcd062a.png) ![](media/150b3fd37cfe184222dece470ef5c802.png)

### The Rotation Sequence (X → Y → Z) in Global RF

The engine uses Tait–Bryan angles, commonly referred to in aerospace and robotics as Roll-Pitch-Yaw. This means, the rotations are applied sequentially in the order: X-axis first, then the Y-axis, and finally the Z-axis relative to the Global RF. When the values are applied, the object rotates around the fixed Global Coordinate System axes.

### The Rotation Sequence (Z → Y → X) in Local Body RF

Because of how 3D rotation matrices multiply, an Extrinsic X-Y-Z sequence in Global RF produces the exact same final spatial orientation as an Intrinsic Z-Y-X sequence in Local RF. This means, to get the same orientation as after XYZ-rotation in Global RF, we need to rotate in ZYX sequence relative to the Local RF.

### Locked reference frames

The reference frame is locked if one of the following features are defined relative to this RF: the Body, Joint or Spring.

### Body shifting and rotation with its CoG RF

We can move and rotate the body with its CoG RF if we check the “Move Body with CoG” checkbox.

## Primitives

Primitives Toolbar is for creating the simple solid models.

### Box

This tool creates a rectangular parallelepiped centered on the user-selected reference frame.

![](media/96aa692c0cdf5422f6e84a6db3c4cdaf.png)

Following box dimensions are defined by the user:

-   Anchor RF: defines the position of the geometric center of symmetry of the Box,
-   Length (X) along X-axis,
-   Width (Y) along Y-axis,
-   Height (Z) along Z-axis.

![](media/168f85dfa7018b872f217d035370f08b.png) ![](media/f2e708c44d038120fd8eaf994e1f929d.png)

### Tube

This tool creates a hollow cylinder (a tube) centered on a user-selected coordinate system.

![](media/2df7e8e08e46cbf5ced24c93d5be43d8.png)

The central axis of the cylinder lies along one of the X, Y, or Z axes, as selected by the user.

Following Tube dimensions are defined by the user:

-   Anchor RF: defines the position of the geometric center of symmetry of the Tube,
-   Outer Radius (mm),
-   Inner Radius (mm),
-   Height (mm) is defined along the user selected axis.

![](media/bdfa4b9f0a09dad859e792741142d6cc.png) ![](media/1338f2b2653ffcc7f9f4c32b4b038e93.png)

### Sphere

This tool creates a solid sphere centered at a user-selected coordinate system with a specified Radius (mm).

![](media/0ccb3e3113dda1ca5f923c421159a3db.png)

Following Sphere dimensions are defined by the user:

-   Anchor RF: defines the position of the geometric center of the Sphere,
-   Sphere Radius (mm).

![](media/787965384bf58ecf69819354dcd22cef.png) ![](media/dfd3d9ea6d12fccc0be0ccc26b96f69c.png)

### Prism

This tool creates a uniform prism centered on a user-selected coordinate system.

![](media/e81b11d501dcf571cb572de5a7e62c42.png)

The central axis of the prism lies along one of the X, Y, or Z axes, as selected by the user.

Following Prism dimensions are defined by the user:

-   Anchor RF: defines the position of the geometric center of symmetry of the Prism,
-   Number of sides,
-   Circumradius (mm),
-   Height (mm) is defined along the user selected axis.

![](media/1d090c94b6d5d38699e058a887225104.png) ![](media/f52e3bf44f20d3025209e58bdb2aea5b.png)

### Torus

This tool creates a solid torus by moving a disk of minor radius along a circle of major radius within a user-selected coordinate system.

![](media/1765c64192c4d57a8ec6f3ac246cd5e4.png)

The central axis of the torus lies along one of the X, Y, or Z axes, as selected by the user.

Following Torus dimensions are defined by the user:

-   Anchor RF: defines the position of the geometric center of symmetry of the Torus,
-   Major Radius (mm),
-   Minor Radius (mm).

![](media/1a3d1800ca5f72c77603f33b53fd949d.png) ![](media/8ec83397bb5ad03a662774110b991956.png)

### Cone

This tool creates a truncated cone centered on a user-selected coordinate system.

![](media/8f535532ae7fdff0b0a4aae7e7cf038e.png)

The central axis of the cone lies along one of the X, Y, or Z axes, as selected by the user.

Following Cone dimensions are defined by the user:

-   Anchor RF: defines the position of the geometric center of symmetry of the Cone position at half of its height,
-   Bottom Radius (mm),
-   Top Radius (mm),
-   Height (mm) is defined along the user selected axis.

![](media/355d7f6fe8acf809af81cd7551c4fc8f.png) ![](media/e21b526d2e34953329f72c83076f817f.png)

### Link

This tool creates a rigid connecting rod with user defined dimensions:

-   Rod Radius (mm),
-   The Radius of two Spheres at the ends (mm).

![](media/b441f7fcb1cd2218fa4b84f2708fdd7b.png)

The Link can be established in one of two ways:

1.  Between user defined Anchor and Target reference frames (then XYZ-dropdown is not considered);
2.  With link’s center at Anchor reference frame along one of the X, Y, or Z axes, as selected by the user. In this case, Target RF field is not considered, and Link Length must be specified.

![](media/810eae23599fd5769fe7a20ffb90ee0c.png) ![](media/4ed7cd6ed67971255ff3963313633bb7.png)

## Boolean

Crate new Body as a new united CAD mesh of two selected bodies: Body_I and Body_J.

![](media/c90fe9f69f8f473196e9e8fe19f67d96.png)

Once the new Body is created, its CoG, mass and inertia properties are automatically calculated and assigned to it. The density of Body_I is considered for the new Body.

If Body_I and Body_J do not intersect, the new body will not be created. In any case, the original Body_I and Body_J remain untouched with all related features (joints, forces, etc.) if defined.

User shall define two bodies to apply the Boolean operation:

-   Body_I: first body for unification,
-   Body_J: second body for unification.

![](media/3078a59189be70ef9a61c6019708782e.png) ![](media/e0d85bf541cd3ac82ee6b1009da20eee.png)

## Gears

Three types of Gear models can be created in the program and considered as the solid bodies: Helical Gear, Inner Gear, and Bevel Gear. The details are described in the Gear Constraint section.
